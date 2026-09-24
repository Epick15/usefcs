import React from "react";
import "moment/locale/es";
import generator from "voucher-code-generator";
import crypt from "node-cryptex";
import "jspdf-autotable";
import jsPDF from "jspdf";
import logoUnsm from "../../assets/images/report/logoUnsm.png";
import logoTipoUnsm from "../../assets/images/report/logoTipoUnsm.png";
import logoEpg from "../../assets/images/report/logoEpg.bmp";
import logoEpg2 from "../../assets/images/report/logoepg.png";
import moment from "moment";
import PNotify from "pnotify/dist/es/PNotify";
import app from "../Constants";
import XLSX from "xlsx";
import axios from "axios";
import config from "../../config";
import logoFcs from "../../assets/images/report/logoFcs.png";
/////////////////////CONST REPORT/////////////////////////////
let mastePosgrade = config.entityName;
let entity = config.entity;

const token = localStorage.getItem("TOKEN") || null;

// MPT
let universityName = "Universidad Nacional de San Martín";
let facultyName = "Facultad de Ciencias de la Salud";
let unityName = "Unidad de Segunda Especialidad";

const imgUnsm = logoUnsm;
const imgUnsm2 = logoTipoUnsm;
const imgFcs = logoFcs;
// MPT

const spiner = (
    <div
        style={{
            position: "fixed",
            zIndex: 10000,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(255,255,255,0.8)",
        }}
    >
        <span className="spinner-border spinner-border-sm mr-1" role="status" />
        {/*<Loader type="ThreeDots" color="#bf009c" height={38} width={38}/>*/}
    </div>
);
const spin = (
    <span className="spinner-border spinner-border-sm mr-1" role="status" />
);
const MuiOption = {
    overrides: {
        MUIDataTable: {
            root: {
                backgroundColor: "#FF000",
            },
            paper: {
                boxShadow: "0 5px 11px 0px rgba(69, 90, 100, 0.3)",
            },
        },
        MuiTypography: {
            h6: {
                fontSize: "1rem",
            },
            caption: {
                fontSize: "1.25rem",
            },
        },
        MUIDataTableHeadCell: {
            root: {
                padding: "2px 0px 1px 7px",
                fontSize: "10px",
            },
            fixedHeader: {
                borderBottom: "1px solid #e2e5e8",
                fontSize: "13px",
                color: "#37474f",
                backgroundColor: "#ecf0f5",
            },
        },
        MUIDataTableBodyCell: {
            root: {
                fontSize: "13px",
                padding: "2px 0px 1px 7px",
                bordertop: "1px solid #e2e5e8",
                whitespace: "nowrap",
            },
        },
        MUIDataTableHead: {
            root: {
                backgroundColor: "#ecf0f5",
                color: "rgb(255, 255, 255)",
                borderBottom: "none",
            },
        },
    },
    textLabels: {
        body: {
            noMatch: "Lo sentimos, no se encontraron registros coincidentes",
            toolTip: "Ordenar",
            columnHeaderTooltip: (column) => `Ordenar por ${column.label}`,
        },
        pagination: {
            next: "Siguiente página",
            previous: "Pagina anterior",
            rowsPerPage: "Filas por página:",
            displayRows: "de",
        },
        toolbar: {
            search: "Buscar",
            downloadCsv: "Descargar",
            print: "Imprimir",
            viewColumns: "Ver columnas",
            filterTable: "Tabla de filtros",
        },
        filter: {
            all: "Todas",
            title: "FILTROS",
            reset: "REINICIAR",
        },
        viewColumns: {
            title: "Mostrar colunas",
            titleAria: "Mostrar / ocultar colunas da tabela",
        },
        selectedRows: {
            text: "fila (s) seleccionada (s)",
            delete: "Eliminar",
            deleteAria: "Eliminar filas seleccionadas",
        },
    },
    pnotice: {
        title: "Advertencia!",
        text: "Complete los campos obligatorios",
        delay: 2000,
    },
    psuccess: {
        title: "Finalizado",
        text: "Datos registrados correctamente",
        delay: 2000,
    },
};
const selectSearchStyle = {
    control: (base, state) => ({
        ...base,
        border: "0 !important",
        borderRadius: "0 !important",
        borderBottom: "1px solid #ced4da !important",
        "&::placeholder": {
            marginLeft: "-7px !important",
        }, // This line disable the blue border
        boxShadow: "0 !important",
        "&:hover": {
            border: "0 !important",
            borderBottomColor: "transparent !important",
            backgroundSize: "100% 100%, 100% 100% !important",
            transitionDuration: " 0.3s !important",
            boxShadow: "none !important",
            backgroundImage:
                "linear-gradient(to top, #4680ff 2px, rgba(70, 128, 255, 0) 2px), linear-gradient(to top, #ced4da 1px, rgba(206, 212, 218, 0) 1px) !important",
        },
    }),
};
///////////////////generador de codigos/////////////////////////

let generateCode = (length) => {
    let code = generator.generate({
        length: length,
        count: 1,
        charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    });
    return code[0];
};
const k = new Buffer(32);
const v = new Buffer(16);

const encryptUrlID = async (id) => {
    const urlID = await crypt.encrypt(id, k, v);
    return urlID;
};
const pdfReportAutoTable = async (title1, title2, columns, data) => {
    let arrayColumn = [];
    columns.map((r) => {
        arrayColumn.push({ header: r.name, dataKey: r.name });
    });
    let arrayData = [];
    data.map((r) => {
        let json_arr = {};
        r.data.map((k, y) => {
            json_arr[arrayColumn[y].header] = k;
        });
        arrayData.push(json_arr);
    });

    // const pdf = new jsPDF({orientation: "l"});
    const pdf = new jsPDF();
    const imgData = logoUnsm;

    pdf.setFontSize(17);
    pdf.setFont("helvetica", "bold");
    pdf.text(30, 20, title1);
    pdf.addImage(imgData, "JPEG", 10, 12, 20, 16);
    pdf.setFontSize(11);
    pdf.setFont("helvetica");
    pdf.text(30, 25, title2);

    pdf.autoTable({
        margin: [28, 10],
        theme: "striped",
        styles: {
            fontSize: 6,
            font: "helvetica",
        },
        headStyles: {
            fillColor: "#009a22",
        },
        startY: 30,
        columns: arrayColumn,
        body: arrayData,
    });

    pdf.save(title2 + ".pdf");
};

const pdfReportAutoTableThreeTitle = async (
    title1,
    program,
    organicMask,
    studyPlanMask,
    admissionPlanMask,
    columns,
    data
) => {
    let arrayColumn = [];
    columns.map((r, i) => {
        arrayColumn.push({ header: r.name, dataKey: r.name });
    });
    let arrayData = [];
    data.map((r, i) => {
        let json_arr = {};
        r.data.map((k, y) => {
            json_arr[arrayColumn[y].header] = k;
        });
        arrayData.push(json_arr);
    });

    // const pdf = new jsPDF({orientation: "l"});
    const pdf = new jsPDF();
    const imgData = logoUnsm;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(title1, 30, 15);
    pdf.addImage(imgData, "JPEG", 10, 10, 20, 18);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(program, 30, 20);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(organicMask, 30, 25);
    pdf.text(studyPlanMask, 30, 30);
    pdf.text(admissionPlanMask, 70, 30);

    pdf.autoTable({
        margin: [28, 10],
        theme: "striped",
        styles: {
            fontSize: 6,
            font: "helvetica",
        },
        headStyles: {
            fillColor: "#009a22",
        },
        startY: 40,
        columns: arrayColumn,
        body: arrayData,
    });

    pdf.save(program + ".pdf");
};
const pdfReportAutoVoucherStudent = async (
    title1,
    facultad,
    program,
    sede,
    student,
    totalPayment,
    columns,
    data
) => {
    let arrayColumn = [];
    columns.map((r, i) => {
        arrayColumn.push({ header: r.name, dataKey: r.name });
    });
    let arrayData = [];
    data.map((r) => {
        let json_arr = {};
        r.data.map((k, y) => {
            json_arr[arrayColumn[y].header] = k;
        });
        arrayData.push(json_arr);
    });

    const pdf = new jsPDF();
    const imgData = logoUnsm;
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTIN", 25, 15);
    pdf.addImage(imgData, "JPEG", 8, 10, 15, 13);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(mastePosgrade, 25, 20);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(title1, pageWidth / 2, 30, "center");

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("FACULTAD", 10, 40);
    pdf.text(":", 34, 40);

    pdf.setFont("helvetica", "normal");
    pdf.text(facultad, 37, 40);

    //
    pdf.setFont("helvetica", "bold");
    pdf.text("PROGRAMA", 10, 45);
    pdf.text(":", 34, 45);
    pdf.setFont("helvetica", "normal");
    pdf.text(program, 37, 45, {
        maxWidth: 150,
        align: "justify",
    });

    pdf.setFont("helvetica", "bold");
    pdf.text("SEDE", 10, 55);
    pdf.text(":", 34, 55);
    pdf.setFont("helvetica", "normal");
    pdf.text(sede, 37, 55);

    pdf.setFont("helvetica", "bold");
    pdf.text("ESTUDIANTE", 10, 60);
    pdf.text(":", 34, 60);
    pdf.setFont("helvetica", "normal");
    pdf.text(student, 37, 60);

    pdf.autoTable({
        margin: [28, 10],
        theme: "grid",
        styles: {
            fontSize: 7,
            font: "helvetica",
            fontStyle: "normal",
        },
        headStyles: {
            font: "helvetica",
            fontStyle: "bold",
            fillColor: "#000",
        },
        startY: 65,
        columns: arrayColumn,
        body: arrayData,
    });
    let finalTable = pdf.lastAutoTable.finalY + 10;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL PAGADO ", 10, finalTable);
    pdf.text(":", 47, finalTable);
    pdf.setFont("helvetica", "normal");
    pdf.text("S/." + totalPayment, 50, finalTable);

    pdf.text("FECHA :", 140, finalTable);
    pdf.setFont("helvetica", "normal");
    pdf.text(moment().format("L"), 155, finalTable);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("ANEXO COMPROBANTES ", pageWidth / 2, finalTable + 15, "center");

    for (let i = 0; i < arrayData.length; i++) {
        pdf.addPage();
        pdf.setFont("helvetica", "bold");
        pdf.text("#", 10, 25);
        pdf.text(":", 29, 25);
        pdf.setFont("helvetica", "normal");
        pdf.text(arrayData[i]["#"], 31, 25);

        pdf.setFont("helvetica", "bold");
        pdf.text("N° RECIBO", 10, 30);
        pdf.text(":", 29, 30);
        pdf.setFont("helvetica", "normal");
        pdf.text(arrayData[i]["N° RECIBO"], 31, 30);

        pdf.setFont("helvetica", "bold");
        pdf.text("FECHA DE RECIBO", 90, 25);
        pdf.text(":", 123, 25);
        pdf.setFont("helvetica", "normal");
        pdf.text(arrayData[i]["FECHA DE RECIBO"], 125, 25);

        pdf.setFont("helvetica", "bold");
        pdf.text("MONTO", 10, 35);
        pdf.text(":", 29, 35);
        pdf.setFont("helvetica", "normal");
        pdf.text(arrayData[i]["MONTO"], 31, 35);

        pdf.setFont("helvetica", "bold");
        pdf.text("PAGO", 10, 40);
        pdf.text(":", 29, 40);
        pdf.setFont("helvetica", "normal");
        pdf.text(arrayData[i]["PAGO"], 31, 40);

        pdf.setFont("helvetica", "bold");
        pdf.text("TIPO", 10, 45);
        pdf.text(":", 29, 45);
        pdf.setFont("helvetica", "normal");
        pdf.text(arrayData[i]["TIPO"], 31, 45);

        //RENDER IMAGENES
        let imgUrl = app.server + app.voucher + arrayData[i].ARCHIVO;
        let logo = await getDataUri(imgUrl);
        pdf.addImage(logo, "PNG", 48, 50, 120, 170);

        pdf.setFont("helvetica", "bold");
        pdf.text("OBSERVACIÓN", 10, 230);
        pdf.text(":", 36, 230);
        pdf.setFont("helvetica", "normal");
        pdf.text(arrayData[i]["OBSERVACIÓN"], 38, 230);
    }

    const pageCount = pdf.internal.getNumberOfPages();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text("Pag " + String(i) + " de " + String(pageCount), 197, 287, {
            align: "right",
        });
    }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save(program + ".pdf");
};
const pdfReportAutoMovementStudentByRangeDate = async (
    arrayData,
    principalOrganit,
    organicUnitDenomination,
    start,
    end,
    total
) => {
    const pdf = new jsPDF();
    const imgData = logoUnsm;

    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 13, 14, 28, 28);
    if (entity === 1) {
        pdf.addImage(logoEpg, "JPEG", 168, 14, 28, 28);
    }
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "normal");

    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", pageWidth / 2, 20, "center");

    pdf.setFontSize(18);
    pdf.text(principalOrganit, pageWidth / 2, 28, "center");

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("REPORTE DE INGRESOS", pageWidth / 2, 38, "center");

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("UNIDAD", 10, 50);
    pdf.text(":", 34, 50);
    pdf.setFont("helvetica", "normal");
    pdf.text(organicUnitDenomination, 37, 50);

    pdf.setFont("helvetica", "bold");
    pdf.text("FECHA", 10, 55);
    pdf.text(":", 34, 55);
    pdf.setFont("helvetica", "normal");
    pdf.text(start + " " + end, 37, 55);

    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL", 10, 60);
    pdf.text(":", 34, 60);
    pdf.setFont("helvetica", "normal");
    pdf.text("S/." + String(total), 37, 60);

    let _data = [];

    arrayData.map((r, index) => {
        _data.push([
            String(r.ID),
            String(r.VOUCHER_CODIGO),
            String(moment(r.VOUCHER_FECHA).format(" DD-MM-YYYY ")),
            String(r.ADMISION),
            String(r.DNI),
            String(r.NOMBRE),
            String(r.MONTO),
            String(r.OBSERVACION),
        ]);
    });

    pdf.autoTable({
        margin: [28, 10],
        theme: "grid",
        styles: {
            fontSize: 7,
            font: "helvetica",
            fontStyle: "normal",
        },
        headStyles: {
            font: "helvetica",
            fontStyle: "bold",
            fillColor: "#000",
        },
        startY: 68,
        columns: [
            "ID",
            "VOUCHER CODIGO",
            "VOUCHER FECHA",
            "ADMISION",
            "DNI",
            "NOMBRE",
            "MONTO",
            "OBSERVACIÓN",
        ],
        body: _data,
    });
    let finalTable = pdf.lastAutoTable.finalY + 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL PAGADO ", 10, finalTable);
    pdf.text(":", 47, finalTable);
    pdf.setFont("helvetica", "normal");
    pdf.text("S/." + String(total), 50, finalTable);

    pdf.text("FECHA :", 140, finalTable);
    pdf.setFont("helvetica", "normal");
    pdf.text(moment().format("L"), 155, finalTable);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("ANEXO COMPROBANTES ", pageWidth / 2, finalTable + 15, "center");

    for (let i = 0; i < arrayData.length; i++) {
        pdf.addPage();
        pdf.setFont("helvetica", "bold");
        pdf.text("#", 10, 25);
        pdf.text(":", 29, 25);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(arrayData[i].ID), 31, 25);

        pdf.setFont("helvetica", "bold");
        pdf.text("N° RECIBO", 10, 30);
        pdf.text(":", 29, 30);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(arrayData[i].VOUCHER_CODIGO), 31, 30);

        // pdf.setFont('helvetica', "bold");
        // pdf.text("FECHA DE RECIBO", 90, 25);
        // pdf.text(":", 123, 25);
        // pdf.setFont("helvetica", "normal");
        // pdf.text(String(arrayData[i].VOUCHER_FECHA), 125, 25);

        pdf.setFont("helvetica", "bold");
        // pdf.text("FECHA DE RECIBO", 70, 25);
        // pdf.text(":", 53, 25);
        pdf.setFont("helvetica", "normal");
        pdf.text(
            String(moment(arrayData[i].VOUCHER_FECHA).format(" DD-MM-YYYY ")),
            53,
            25
        );

        pdf.setFont("helvetica", "bold");
        // pdf.text("ESTUDIANTE", 70, 30);
        // pdf.text(":", 53, 30);
        pdf.setFont("helvetica", "normal");
        pdf.text(
            String(arrayData[i].NOMBRE + " / " + arrayData[i].DNI),
            53,
            30
        );

        pdf.setFont("helvetica", "bold");
        pdf.text("MONTO", 10, 35);
        pdf.text(":", 29, 35);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(arrayData[i].MONTO), 31, 35);

        pdf.setFont("helvetica", "bold");
        pdf.text("PAGO", 10, 40);
        pdf.text(":", 29, 40);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(arrayData[i].VOUCHER_STATE), 31, 40);

        pdf.setFont("helvetica", "bold");
        pdf.text("TIPO", 10, 45);
        pdf.text(":", 29, 45);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(arrayData[i].VOUCHER_TYPE), 31, 45);

        //RENDER IMAGENES

        let imgUrl = app.server + app.voucher + arrayData[i].VOUCHER_URL;
        let logo = await getDataUri(imgUrl);
        pdf.addImage(logo, "PNG", 48, 50, 120, 170);

        pdf.setFont("helvetica", "bold");
        pdf.text("OBSERVACIÓN", 10, 230);
        pdf.text(":", 36, 230);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(arrayData[i].OBSERVACION), 38, 230);
    }

    const pageCount = pdf.internal.getNumberOfPages();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text("Pag " + String(i) + " de " + String(pageCount), 197, 287, {
            align: "right",
        });
    }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("RI-" + organicUnitDenomination + ".pdf");
};
const pdfReportAutoConceptStudent = async (
    title1,
    facultad,
    program,
    sede,
    student,
    totalPayment,
    columns,
    data
) => {
    let arrayColumn = [];
    columns.map((r) => {
        arrayColumn.push({ header: r.name, dataKey: r.name });
    });
    let arrayData = [];

    let tempProcess = [];
    //obteniendo solo semestres para genera un nuevo array por semestre
    data.map((r) => tempProcess.push(r.data[3]));
    let uniqueArray = tempProcess.filter((item, index, array) => {
        return array.indexOf(item) === index;
    });

    //declaramos el array final como vacio
    let _finalData = [];

    uniqueArray.map((m, l) => {
        // declaramos la nueva estructura para los hijos del array
        let _temp = {
            process: uniqueArray[l],
            data: [],
        };
        data.map((r, i) => {
            //mapeamos el array inicial, y preguntamos si pertenecen a dicho proceso
            if (r.data[3] == uniqueArray[l]) {
                let json_arr = {};
                //generamos el formato que tiene el pdf de acuerdo a las columnas
                r.data.map((k, y) => {
                    if (r.data[y] == 0) {
                        json_arr[arrayColumn[y].header] = k + 1;
                    } else {
                        json_arr[arrayColumn[y].header] = k;
                    }
                    // json_arr[arrayColumn[y].header] = k;
                });
                //guardamos en un array temporal con la nueva estructura
                _temp.data.push(json_arr);
            }
        });
        //guardamos el total en el array final
        _finalData.push(_temp);
    });

    console.log(_finalData);

    // const pdf = new jsPDF({orientation: "l"});
    const pdf = new jsPDF();
    const imgData = logoUnsm;
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTIN", 25, 15);
    pdf.addImage(imgData, "JPEG", 8, 10, 15, 13);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(mastePosgrade, 25, 20);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(title1, pageWidth / 2, 30, "center");

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("FACULTAD", 10, 40);
    pdf.text(":", 34, 40);

    pdf.setFont("helvetica", "normal");
    pdf.text(facultad, 37, 40);

    //
    pdf.setFont("helvetica", "bold");
    pdf.text("PROGRAMA", 10, 45);
    pdf.text(":", 34, 45);
    pdf.setFont("helvetica", "normal");
    pdf.text(program, 37, 45, {
        maxWidth: 150,
        align: "justify",
    });

    pdf.setFont("helvetica", "bold");
    pdf.text("SEDE", 10, 55);
    pdf.text(":", 34, 55);
    pdf.setFont("helvetica", "normal");
    pdf.text(sede, 37, 55);

    pdf.setFont("helvetica", "bold");
    pdf.text("ESTUDIANTE", 10, 60);
    pdf.text(":", 34, 60);
    pdf.setFont("helvetica", "normal");
    pdf.text(student, 37, 60);

    let initial_autotable = 65;
    for (let i = 0; _finalData.length > i; i++) {
        pdf.autoTable({
            margin: [28, 10],
            theme: "grid",
            styles: {
                fontSize: 7,
                font: "helvetica",
                fontStyle: "normal",
            },
            headStyles: {
                font: "helvetica",
                fontStyle: "bold",
                fillColor: "#000",
            },
            columnStyles: {
                0: { cellWidth: 7 },
                1: { cellWidth: 60 },
                2: { cellWidth: 18 },
                3: { cellWidth: 16 },
                4: { cellWidth: 16 },
                5: { cellWidth: 35 },
                6: { cellWidth: 35 },
            },
            startY: initial_autotable,
            columns: arrayColumn,
            body: _finalData[i].data,
        });
        initial_autotable = pdf.lastAutoTable.finalY + 5;
    }

    let finalTable = pdf.lastAutoTable.finalY + 10;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL PAGADO ", 10, finalTable);
    pdf.text(":", 47, finalTable);
    pdf.setFont("helvetica", "normal");
    pdf.text("S/." + totalPayment, 50, finalTable);

    pdf.text("FECHA :", 140, finalTable);
    pdf.setFont("helvetica", "normal");
    pdf.text(moment().format("L"), 155, finalTable);

    const pageCount = pdf.internal.getNumberOfPages();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text("Pag " + String(i) + " de " + String(pageCount), 197, 287, {
            align: "right",
        });
    }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save(program + ".pdf");
};
const pdfReportAutoPaymentProgramAdmision = async (
    title1,
    facultad,
    program,
    sede,
    student,
    totalAcept,
    totalRegister,
    columns,
    data,
    movements
) => {
    let arrayColumn = [];
    columns.map((r) => {
        arrayColumn.push({ header: r.name, dataKey: r.name });
    });
    let arrayData = [];
    data.map((r) => {
        let json_arr = {};
        r.data.map((k, y) => {
            json_arr[arrayColumn[y].header] = k;
        });
        arrayData.push(json_arr);
    });

    // const pdf = new jsPDF({orientation: "l/p"});
    const pdf = new jsPDF();
    const imgData = logoUnsm;
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTIN", 25, 15);
    pdf.addImage(imgData, "JPEG", 8, 10, 15, 13);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(mastePosgrade, 25, 20);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(title1, pageWidth / 2, 30, "center");

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("PROGRAMA", 10, 40);
    pdf.text(":", 34, 40);

    pdf.setFont("helvetica", "normal");
    // pdf.text(facultad, 37, 40);
    let splitTitle = pdf.splitTextToSize(facultad, 160);
    pdf.text(splitTitle, 37, 40);

    //
    pdf.setFont("helvetica", "bold");
    pdf.text("UNIDAD", 10, 50);
    pdf.text(":", 34, 50);
    pdf.setFont("helvetica", "normal");
    pdf.text(program, 37, 50);

    pdf.setFont("helvetica", "bold");
    pdf.text("SEDE", 10, 55);
    pdf.text(":", 34, 55);
    pdf.setFont("helvetica", "normal");
    pdf.text(student, 37, 55);

    pdf.setFont("helvetica", "bold");
    pdf.text("PLAN", 10, 60);
    pdf.text(":", 34, 60);
    pdf.setFont("helvetica", "normal");
    pdf.text(sede, 37, 60);

    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL", 10, 65);
    pdf.text(":", 34, 65);
    pdf.setFont("helvetica", "normal");
    pdf.text("S/" + totalAcept, 37, 65);

    pdf.autoTable({
        margin: [28, 10],
        theme: "grid",
        styles: {
            fontSize: 7,
            font: "helvetica",
            fontStyle: "normal",
        },
        headStyles: {
            font: "helvetica",
            fontStyle: "bold",
            fillColor: "#00c564",
        },
        startY: 70,
        columns: arrayColumn,
        body: arrayData,
    });
    let finalTable = pdf.lastAutoTable.finalY + 10;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL PAGO ACEPTADO ", 10, finalTable);
    pdf.text(":", 60, finalTable);
    pdf.setFont("helvetica", "normal");
    pdf.text("S/." + totalAcept, 62, finalTable);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL PAGO REGISTRADO ", 10, finalTable + 5);
    pdf.text(":", 60, finalTable + 5);
    pdf.setFont("helvetica", "normal");
    pdf.text("S/." + totalRegister, 62, finalTable + 5);

    // pdf.text("FECHA :", 170, finalTable);
    pdf.setFont("helvetica", "normal");
    pdf.text(moment().format("L"), 183, finalTable);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("ANEXO COMPROBANTES ", pageWidth / 2, finalTable + 15, "center");

    // const pdf = new jsPDF({orientation: "l"});
    // pdf.orientation : 'p';
    for (let i = 0; i < movements.length; i++) {
        pdf.addPage();
        pdf.setFont("helvetica", "bold");
        pdf.text("#", 10, 25);
        pdf.text(":", 29, 25);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(i + 1), 31, 25);

        pdf.setFont("helvetica", "bold");
        pdf.text("N° RECIBO", 10, 30);
        pdf.text(":", 29, 30);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(movements[i].Movement.voucher_code), 31, 30);

        pdf.setFont("helvetica", "bold");
        // pdf.text("FECHA DE RECIBO", 70, 25);
        // pdf.text(":", 53, 25);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(movements[i].Movement.voucher_date), 53, 25);

        pdf.setFont("helvetica", "bold");
        // pdf.text("ESTUDIANTE", 70, 30);
        // pdf.text(":", 53, 30);
        pdf.setFont("helvetica", "normal");
        pdf.text(
            String(
                movements[i].Person.name +
                    " / " +
                    movements[i].Person.document_number
            ),
            53,
            30
        );

        pdf.setFont("helvetica", "bold");
        pdf.text("MONTO", 10, 35);
        pdf.text(":", 29, 35);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(movements[i].Movement.voucher_amount), 31, 35);

        pdf.setFont("helvetica", "bold");
        pdf.text("PAGO", 10, 40);
        pdf.text(":", 29, 40);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(movements[i].Movement.state), 31, 40);

        pdf.setFont("helvetica", "bold");
        pdf.text("TIPO", 10, 45);
        pdf.text(":", 29, 45);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(movements[i].Movement.type), 31, 45);

        //RENDER IMAGENES
        let imgUrl =
            app.server + app.voucher + movements[i].Movement.voucher_url;
        let logo = await getDataUri(imgUrl);
        pdf.addImage(logo, "PNG", 48, 50, 120, 170);

        pdf.setFont("helvetica", "bold");
        pdf.text("OBSERVACIÓN", 10, 230);
        pdf.text(":", 36, 230);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(movements[i].Movement.observation), 38, 230);
    }

    const pageCount = pdf.internal.getNumberOfPages();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text("Pag " + String(i) + " de " + String(pageCount), 197, 287, {
            align: "right",
        });
    }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save(title1 + "-" + facultad + "-" + sede + ".pdf");
};

const getDataUri = async (url) => {
    const url2 = await listVoucher(url);

    return new Promise((resolve) => {
        let image = new Image();
        image.setAttribute("crossOrigin", "anonymous"); //getting images from external domain

        image.onload = function () {
            let canvas = document.createElement("canvas");
            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;

            //next three lines for white background in case png has a transparent background
            let ctx = canvas.getContext("2d");
            ctx.fillStyle = "#fff"; /// set white fill style
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            canvas.getContext("2d").drawImage(this, 0, 0);

            resolve(canvas.toDataURL("image/jpeg"));
        };

        image.src = url2;
    });
};

const listVoucher = async (voucher_url) => {
    const url = voucher_url;
    try {
        const res = await axios.get(url, {
            responseType: "arraybuffer",
            headers: {
                "Content-Type": "application/json",
                "x-accesss-token": token,
            },
        });
        if (res.data) {
            const imgUrl = window.URL.createObjectURL(new Blob([res.data]));
            // this.imgVoucher.src = imgUrl
            return imgUrl;
        }
    } catch (err) {
        PNotify.error({
            title: "No se encontro Foto",
            text: voucher_url,
            delay: 6000,
        });

        console.log(err);
    }
};
const pdfReportAutoRecordAcademico = async (
    person,
    program,
    sedeRegistration,
    unitRegistration,
    data
) => {
    let arrayColumn = [];
    let columns = [];

    // const pdf = new jsPDF({orientation: "l"});
    const pdf = new jsPDF();
    const imgData = logoUnsm;
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTIN", 25, 15);
    pdf.addImage(imgData, "JPEG", 8, 10, 15, 13);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(mastePosgrade, 25, 20);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("RECORD ACADEMICO", pageWidth / 2, 30, "center");

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("PROGRAMA", 10, 40);
    pdf.text(":", 34, 40);

    pdf.setFont("helvetica", "normal");
    // pdf.text(program, 37, 40);

    let splitTitle = pdf.splitTextToSize(program, 160);
    pdf.text(splitTitle, 37, 40);

    //
    pdf.setFont("helvetica", "bold");
    pdf.text("UNIDAD", 10, 50);
    pdf.text(":", 34, 50);
    pdf.setFont("helvetica", "normal");
    pdf.text(unitRegistration, 37, 50);

    pdf.setFont("helvetica", "bold");
    pdf.text("SEDE", 10, 55);
    pdf.text(":", 34, 55);
    pdf.setFont("helvetica", "normal");
    pdf.text(sedeRegistration, 37, 55);

    pdf.setFont("helvetica", "bold");
    pdf.text("ESTUDIANTE", 10, 60);
    pdf.text(":", 34, 60);
    pdf.setFont("helvetica", "normal");
    pdf.text(person, 37, 60);

    let totalAprovedCourse = 0;
    let totalAprovedCredit = 0;
    let aprovedPromedi = 0;
    let totalCourse = 0;
    let totalCredit = 0;
    let generalPromedi = 0;
    let initialTableY = 70;

    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.text(moment().format("HH:mm DD/MM/YYYY "), 181, initialTableY - 2);
    pdf.setFontSize(10);
    for (let i = 0; i < data.length; i++) {
        let tempBody = [];
        for (let j = 0; j < data[i].Registration_course.length; j++) {
            let typeCourse =
                data[i].Registration_course[j].type_course === "Obligatorio"
                    ? "O"
                    : "E";
            totalCourse = totalCourse + 1;
            totalCredit = totalCredit + data[i].Registration_course[j].credits;
            generalPromedi =
                generalPromedi + data[i].Registration_course[j].note;
            totalAprovedCourse =
                data[i].Registration_course[j].note >= 14
                    ? totalAprovedCourse + 1
                    : totalAprovedCourse;
            aprovedPromedi =
                data[i].Registration_course[j].note >= 14
                    ? aprovedPromedi + data[i].Registration_course[j].note
                    : aprovedPromedi;
            totalAprovedCredit =
                data[i].Registration_course[j].note >= 14
                    ? totalAprovedCredit +
                      data[i].Registration_course[j].credits
                    : totalAprovedCredit;
            let noteText = numberToLetter(
                parseInt(data[i].Registration_course[j].note)
            );
            tempBody.push([
                data[i].Registration_course[j].id,
                data[i].Registration_course[j].denomination,
                "NN",
                "",
                typeCourse,
                data[i].Registration_course[j].credits,
                data[i].Registration_course[j].note + " " + noteText,
            ]);
        }
        pdf.setFont("helvetica", "bold");
        pdf.text("SEMESTRE", 10, initialTableY - 2);
        pdf.setFont("helvetica", "normal");
        pdf.text(
            data[i].Academic_semester.Academic_calendar.denomination +
                "-" +
                data[i].Academic_semester.denomination,
            37,
            initialTableY - 2
        );
        pdf.autoTable({
            margin: [28, 10],
            theme: "grid",
            styles: {
                fontSize: 7,
                font: "helvetica",
                fontStyle: "normal",
            },
            headStyles: {
                font: "helvetica",
                fontStyle: "bold",
                fillColor: "#000",
            },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 119 },
                2: { cellWidth: 7 },
                3: { cellWidth: 8 },
                4: { cellWidth: 8 },
                5: { cellWidth: 8 },
                6: { cellWidth: 25 },
            },
            startY: initialTableY,
            head: [["CODIGO", "CURSO", "CV", "TN", "TC", "CR", "NOTA"]],
            body: tempBody,
        });
        initialTableY = pdf.lastAutoTable.finalY + 10;
    }
    initialTableY = pdf.lastAutoTable.finalY;
    pdf.setFont("helvetica", "normal");
    pdf.text("TOTAL CURSOS", 10, initialTableY + 15);
    pdf.text(":", 50, initialTableY + 15);
    pdf.setFont("helvetica", "normal");
    pdf.text(String(totalCourse), 52, initialTableY + 15);

    pdf.setFont("helvetica", "normal");
    pdf.text("TOTAL CREDITOS", 10, initialTableY + 20);
    pdf.text(":", 50, initialTableY + 20);
    pdf.setFont("helvetica", "normal");
    pdf.text(String(totalCredit), 52, initialTableY + 20);

    pdf.setFont("helvetica", "normal");
    pdf.text("PROMEDIO GENERAL", 10, initialTableY + 25);
    pdf.text(":", 50, initialTableY + 25);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        String(Math.round((generalPromedi / totalCourse) * 100) / 100),
        52,
        initialTableY + 25
    );

    pdf.setFont("helvetica", "normal");
    pdf.text("TOTAL DE CURSOS APROBADOS", 110, initialTableY + 15);
    pdf.text(":", 173, initialTableY + 15);
    pdf.setFont("helvetica", "normal");
    pdf.text(String(totalAprovedCourse), 175, initialTableY + 15);

    pdf.setFont("helvetica", "normal");
    pdf.text("TOTAL DE CREDITOS APROBADOS", 110, initialTableY + 20);
    pdf.text(":", 173, initialTableY + 20);
    pdf.setFont("helvetica", "normal");
    pdf.text(String(totalAprovedCredit), 175, initialTableY + 20);

    pdf.setFont("helvetica", "normal");
    pdf.text("PROMEDIO CR. APR..", 110, initialTableY + 25);
    pdf.text(":", 173, initialTableY + 25);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        String(
            totalAprovedCourse !== 0
                ? Math.round((aprovedPromedi / totalAprovedCourse) * 100) / 100
                : 0
        ),
        175,
        initialTableY + 25
    );
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text("Leyenda :", 10, initialTableY + 40);
    pdf.text("TN : Tipo de nota", 30, initialTableY + 40);
    pdf.text(
        "TC : Tipo de curso(O=Obligatorio, E=Electivo)",
        55,
        initialTableY + 40
    );
    pdf.text("CR : Nro.Cred x Curso", 118, initialTableY + 40);
    pdf.text("CV : Curso Convalidado(C)", 150, initialTableY + 40);
    // pdf.text("FECHA :", 170, finalTable);

    const pageCount = pdf.internal.getNumberOfPages();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text("Pag " + String(i) + " de " + String(pageCount), 197, 287, {
            align: "right",
        });
    }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("RA-" + person + ".pdf");
};
const pdfReportAutoTableFichaRegistration = async (
    process,
    program,
    person,
    unitRegistration,
    sedeRegistration,
    data,
    created,
    personData,
    admissionPlan
) => {
    let arrayData = [];

    let typeCourse = "";
    let totalCredit = 0;

    data.map((r) => {
        totalCredit = parseFloat(r.credits) + totalCredit;
        typeCourse = r.type_course == "Obligatorio" ? "O" : "E";
        return arrayData.push([
            r.code,
            r.denomination,
            typeCourse,
            r.ciclo,
            r.credits,
        ]);
    });

    const pdf = new jsPDF();
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    pdf.addImage(imgUnsm, "PNG", 10, 10, 24, 24);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    pdf.text(universityName.toUpperCase(), pageWidth / 2, 16, "center");
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "normal");
    pdf.text(facultyName.toUpperCase(), pageWidth / 2, 23, "center");
    pdf.setFontSize(15);
    pdf.setFont("helvetica", "normal");
    pdf.text(unityName.toUpperCase(), pageWidth / 2, 31, "center");
    pdf.addImage(imgFcs, "PNG", 175, 10, 24, 24);

    pdf.setFontSize(19);
    pdf.setFont("helvetica", "bold");
    pdf.text("FICHA DE MATRÍCULA", pageWidth / 2, 55, "center");
    pdf.setLineWidth(0.3);
    pdf.line(10, 57, 200, 57);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("PROGRAMA", 10, 65);
    pdf.text(":", 34, 65);
    pdf.setFont("helvetica", "normal");
    let splitProgram = pdf.splitTextToSize(program.toUpperCase(), 162);
    pdf.text(splitProgram, 37, 65);

    pdf.setFont("helvetica", "bold");
    pdf.text("UNIDAD", 10, 75);
    pdf.text(":", 34, 75);
    pdf.setFont("helvetica", "normal");
    pdf.text(unitRegistration.toUpperCase(), 37, 75);

    pdf.setFont("helvetica", "bold");
    pdf.text("SEDE", 10, 80);
    pdf.text(":", 34, 80);
    pdf.setFont("helvetica", "normal");
    pdf.text(sedeRegistration, 37, 80);

    pdf.setFont("helvetica", "bold");
    pdf.text("ESTUDIANTE", 10, 85);
    pdf.text(":", 34, 85);
    pdf.setFont("helvetica", "normal");
    pdf.text(personData.name2, 37, 85);

    pdf.setFont("helvetica", "bold");
    pdf.text("CÓDIGO/DNI", 10, 90);
    pdf.text(":", 34, 90);
    pdf.setFont("helvetica", "normal");
    pdf.text(personData.document_number, 37, 90);

    pdf.setFont("helvetica", "bold");
    pdf.text("INGRESO", 10, 95);
    pdf.text(":", 34, 95);
    pdf.setFont("helvetica", "normal");
    pdf.text(admissionPlan, 37, 95);
    // KKKKKKK
    pdf.setFont("helvetica", "bold");
    pdf.text("FECHA", 10, 100);
    pdf.text(":", 34, 100);
    pdf.setFont("helvetica", "normal");
    pdf.text(moment(created).format("DD/MM/YYYY"), 37, 100);

    pdf.setFont("helvetica", "bold");
    pdf.text("SEMESTRE", 10, 105);
    pdf.text(":", 34, 105);
    pdf.setFont("helvetica", "normal");
    pdf.text(process, 37, 105);

    let head = [
        [
            "CÓDIGO",
            "ASIGNATURA",
            { content: "TIPO", styles: { halign: "center" } },
            { content: "CICLO", styles: { halign: "center" } },
            { content: "CRÉDITOS", styles: { halign: "center" } },
        ],
    ];
    pdf.autoTable({
        margin: [20, 10],
        theme: "grid",
        styles: {
            fontSize: 7,
            font: "helvetica",
            fontStyle: "normal",
        },
        headStyles: {
            font: "helvetica",
            fontStyle: "bold",
            fillColor: "#000",
        },
        columnStyles: {
            0: { cellWidth: 25 },
            // 1: { cellWidth: 115 },
            2: { cellWidth: 10, halign: "center" },
            3: { cellWidth: 12, halign: "center" },
            4: { cellWidth: 17, halign: "center" },
        },
        startY: 115,
        head: head,
        body: arrayData,
    });

    let finalTable = pdf.lastAutoTable.finalY + 10;

    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    pdf.text("TIPO:", 10, finalTable - 5);
    pdf.setFont("helvetica", "normal");
    pdf.text("O: Obligatorio, E: Electivo", 18, finalTable - 5);

    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL CRÉDITOS:", 170, finalTable - 5);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(String(totalCredit), 196, finalTable - 5);

    pdf.setDrawColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("black");
    pdf.setFontSize(8);
    pdf.setLineWidth(0.5);
    pdf.line(25, finalTable + 37, 65, finalTable + 37);
    pdf.text("FIRMA DEL ESTUDIANTE", 28, finalTable + 40);

    pdf.setFontSize(8);
    pdf.setLineWidth(0.5);
    pdf.line(142, finalTable + 37, 185, finalTable + 37);
    pdf.text("FIRMA DEL COORDINADOR", 145, finalTable + 40);

    pdf.setFontSize(7);

    const pageCount = pdf.internal.getNumberOfPages();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text("Pag " + String(i) + " de " + String(pageCount), 197, 287, {
            align: "right",
        });
    }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("FM-" + person + ".pdf");
};

const pdfReportAutoTableCertStudy2 = async (data) => {
    let student = data.studentData.Person.name;
    let dni = data.studentData.Person.document_number;
    let photo = data.studentData.Person.photo;
    let program = data.studentData.Program.denomination;
    let certyDescription = data.principalOrganicUnit.description_document;

    let totalCredit = data.totalCredit;
    let averageScore = data.averageScore;
    let observation = data.observation;
    let correlative = data.correlative;
    let date = data.date;
    let record = data.dataRegistration;

    let principalOrganicUnit = data.principalOrganicUnit.description;
    let certyAbbreviation = data.principalOrganicUnit.abbreviation;
    let authorityTypeAname = data.authorityTypeA.person;
    let authorityTypeAcharge = data.authorityTypeA.charge;
    let authorityTypeGname = data.authorityTypeG.person;
    let authorityTypeGcharge = data.authorityTypeG.charge;

    const pdf = new jsPDF();

    pdf.setFontSize(4);
    pdf.setTextColor(193, 242, 230);
    let waterMark = 0;
    for (let i = 0; i < 300; i++) {
        pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", 0, waterMark);
        pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", 29, waterMark);
        pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", 58, waterMark);
        pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", 87, waterMark);
        pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", 116, waterMark);
        pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", 145, waterMark);
        pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", 174, waterMark);
        pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", 203, waterMark);
        pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", 232, waterMark);
        pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", 261, waterMark);
        waterMark = waterMark + 1.3;
    }

    pdf.setTextColor(12, 13, 14);
    const imgData = logoUnsm;
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 7, 14, 28, 28);
    if (entity === 1) {
        pdf.addImage(logoEpg2, "JPEG", 175, 14, 27, 26);
        pdf.setFontSize(15);
        pdf.text("ESCUELA DE SEUNSM", pageWidth / 2, 35, "center");
    }

    pdf.setFontSize(20);
    pdf.setFont("helvetica", "normal");

    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", pageWidth / 2, 20, "center");

    pdf.setFontSize(22);
    pdf.setFont("helvetica", "normal");

    let textoCompleto =
        "El " +
        authorityTypeGcharge +
        " de la Universidad Nacional de San Martín, " +
        "**CERTIFICA**" +
        " que Don(ña) " +
        "**" +
        student +
        "** " +
        "con código de matrícula " +
        "**" +
        dni +
        "**," +
        " ha realizado estudios en la " +
        certyAbbreviation +
        " en el " +
        "**Programa de " +
        program +
        "**," +
        " habiendo aprobado los siguientes cursos:";

    pdf.setFontSize(19);
    pdf.setFont("times", "bold");
    pdf.text(
        "CERTIFICADO DE ESTUDIOS N°" + correlative,
        pageWidth / 2,
        42,
        "center"
    );
    pdf.setLineWidth(0.5);
    // pdf.line(40, 41, 175, 41);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    //DESDE AQUI
    let startY = 52;
    let startX = 10;

    const fontSize = 4;
    const lineSpacing = 6;

    const regex = /(\*{2})+/g; // all "**" words
    const textWithoutBoldMarks = textoCompleto.replace(regex, "");

    let splitTextWithoutBoldMarks = pdf.splitTextToSize(
        textWithoutBoldMarks,
        199
    );

    let charsMapLength = 0;
    let position = 0;
    let isBold = false;
    // <><>><><>><>><><><><><>>><><<><><><><>

    const printCharacters = (
        doc,
        textObject,
        startY,
        startX,
        fontSize,
        lineSpacing
    ) => {
        const startXCached = startX;
        const boldStr = "bold";
        const normalStr = "normal";

        textObject.map((row) => {
            Object.entries(row).map(([key, value]) => {
                pdf.setFont("helvetica", value.bold ? boldStr : normalStr);

                pdf.text(value.char, startX, startY);
                startX = startX + pdf.getStringUnitWidth(value.char) * fontSize;
            });
            startX = startXCached;
            startY += lineSpacing;
        });
    };
    // power algorithm to determine which char is bold
    let textRows = splitTextWithoutBoldMarks.map((row, i) => {
        const charsMap = row.split("");

        const chars = charsMap.map((char, j) => {
            position = charsMapLength + j + i;

            let currentChar = textoCompleto.charAt(position);

            if (currentChar === "*") {
                const spyNextChar = textoCompleto.charAt(position + 1);
                if (spyNextChar === "*") {
                    // double asterix marker exist on these position's so we toggle the bold state
                    isBold = !isBold;
                    currentChar = textoCompleto.charAt(position + 2);

                    // now we remove the markers, so loop jumps to the next real printable char
                    let removeMarks = textoCompleto.split("");
                    removeMarks.splice(position, 2);
                    textoCompleto = removeMarks.join("");
                }
            }

            return { char: currentChar, bold: isBold };
        });
        charsMapLength += charsMap.length;

        return { ...chars };
    });
    printCharacters(pdf, textRows, startY, startX, fontSize, lineSpacing);

    //HASTA AQUI
    // pdf.text(textoCompleto, 10, 50, {
    //     maxWidth: 190,
    //     align: 'justify'
    // });
    pdf.setFontSize(10);
    pdf.setFont("times", "bold");
    // pdf.text('N' + correlative, 184, 70);
    let header = [["ASIGNATURA", "CREDITOS", "CALIFICACIONES", "AÑO"]];
    pdf.autoTable({
        margin: [{ left: 10, right: 10, bottom: 5 }],
        theme: "plain",
        startY: 74,
        tableLineColor: [0, 0, 0],
        tableLineWidth: 1,
        styles: {
            fontSize: 8,
            font: "helvetica",
            lineWidth: 0,
        },
        columnStyles: {
            0: { cellWidth: 123, halign: "rigth" },
            1: { cellWidth: 21.6, halign: "center" },
            2: { cellWidth: 33.2, halign: "rigth" },
            3: { halign: "center" },
        },
        headStyles: {
            fontStyle: "bold",
            font: "helvetica",
            fontSize: 8,
            lineColor: [0, 0, 0],
            lineWidth: 0.5, // fillColor: [0, 0, 0],
            // fontSize: 15,
        },

        bodyStyles: {
            // fillColor70,
            // lineWidth: 0.5,
            font: "helvetica",
            fontSize: 7,
        },
        willDrawCell: (data) => {
            if (data.section === "body") {
                // console.log(data.cell.raw)
                // if (data.row.index === 0 && data.column.index === 0) {
                //
                //     let endIndex = data.cell.raw.indexOf('/');
                //     let boldText = data.cell.raw.substring(0, endIndex);
                //     let normalText = data.cell.raw.substring(endIndex);
                //     // console.log("boldText is  " + boldText + "  normalText is  " + normalText);
                //     // data.cell.raw = '<b>'+boldText+'</b>'+normalText;
                //
                //
                //     // data.cell.text = '<b>' + boldText + '</b>' + normalText;
                //
                //     console.log("after data cell iss  ");
                //     console.log('<b>' + data.cell.raw + '</b>');
                //
                // }

                let text = String(data.cell.raw);

                if (text.indexOf("CICLO") >= 0) {
                    pdf.setFont("helvetica", "bold");
                    data.cell.text = data.cell.raw;
                }
            }
        },

        head: header,
        body: record,
    });

    let finalTable = pdf.lastAutoTable.finalY + 5;

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL DE CREDITOS :", 12, finalTable - 1);
    pdf.text("PROMEDIO PONDERADO :", 140.6, finalTable - 1);
    pdf.text("OBSERVACIONES :", 12, finalTable + 6);

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(String(totalCredit), 47, finalTable - 1);
    pdf.text(String(averageScore), 179, finalTable - 1);
    pdf.text(String(observation), 40, finalTable + 6, {
        maxWidth: 158,
        align: "justify",
    });

    pdf.setLineWidth(0.5);

    //LINEAS DENTRO DE LA TABLA
    // pdf.line(118.9, 80, 118.9, finalTable - 5);
    pdf.line(133, 76, 133, finalTable - 5);
    pdf.line(154.56, 76, 154.56, finalTable - 5);
    pdf.line(187.8, 76, 187.8, finalTable - 5);

    //FINAL DE LA TABLA LINEAS
    //primera linea horizontal
    pdf.setLineWidth(1);
    pdf.line(10, finalTable + 2, 200, finalTable + 1);
    pdf.line(10, finalTable + 12, 200, finalTable + 12);
    let falta = 289 - finalTable;
    //Lateral izauierdo
    pdf.line(10, finalTable - 5, 10, finalTable + falta);
    //Lateral derecho
    pdf.line(200, finalTable - 5, 200, finalTable + falta);
    //Linera Final
    pdf.line(10, 288.5, 200, 288.5);
    if (finalTable >= 220) {
        pdf.addPage();
        finalTable = 10;
        pdf.setLineWidth(1);
        //Lateral izauierdo
        pdf.line(10, finalTable - 0.5, 10, finalTable + 70.5);
        //Lateral derecho
        pdf.line(200, finalTable - 0.5, 200, finalTable + 70.5);
        pdf.line(10, 10, 200, 10); //1 horizontal
        pdf.line(10, 80, 200, 80);
    }

    let imgUrl = app.server + "photo/" + photo;
    let imgPhoto = await getDataUri(imgUrl);
    pdf.addImage(imgPhoto, "JPEG", 12, finalTable + 25, 33, 40);
    pdf.setLineWidth(0.5);
    //CUADRO DE FOTO
    pdf.line(12, finalTable + 25, 45, finalTable + 25); //1 horizontal
    pdf.line(12, finalTable + 65, 45, finalTable + 65); //2 horizontal
    pdf.line(12.2, finalTable + 25, 12.2, finalTable + 65); //1 vertical
    pdf.line(44.8, finalTable + 25, 44.8, finalTable + 65); //2 vertical

    pdf.setFontSize(8);
    pdf.text(
        "Así consta en las actas, de la " +
            principalOrganicUnit +
            " a las que me remito en caso necesario.",
        12,
        finalTable + 17
    );
    pdf.setFontSize(10);
    pdf.text(
        "ESCALA DE CALIFICATIVOS: 0-13 Desaprobado, 14-20 Aprobado.",
        12,
        finalTable + 22
    );
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("Tarapoto " + date, 140, finalTable + 22);

    pdf.setFontSize(7);
    pdf.setLineWidth(0.5);
    //FIRTS AUTORITY
    pdf.line(50, finalTable + 48, 98, finalTable + 48);
    pdf.setFont("helvetica", "bold");
    pdf.text(authorityTypeGname, 50, finalTable + 51);
    pdf.setFont("helvetica", "normal");
    pdf.text(authorityTypeGcharge, 50, finalTable + 53.3);
    //SECOND AUTORITY
    pdf.line(130, finalTable + 48, 185, finalTable + 48);
    pdf.setFont("helvetica", "bold");
    pdf.text(authorityTypeAname, 130, finalTable + 51);
    pdf.setFont("helvetica", "normal");

    pdf.text(authorityTypeAcharge, 130, finalTable + 53.3);

    //membretado

    pdf.save("CERTIFICADO-ESTUDIOS-" + student + ".pdf");
};

const pdfReportAutoTableCertStudySeunsm = async (data) => {
    let student = data.studentData.Person.name;
    let photo = data.studentData.Person.photo;
    let dni = data.studentData.Person.document_number;
    let program = data.studentData.Program.denomination;
    let totalCredit = data.totalCredit;
    let averageScore = data.averageScore;
    let observation = data.observation;
    let correlative = data.correlative;
    let date = data.date;
    let record = data.dataRegistration;
    let principalOrganicUnit = data.principalOrganicUnit.description;
    let certyAbbreviation = data.principalOrganicUnit.abbreviation;
    let authorityTypeAname = data.authorityTypeA.person;
    let authorityTypeAcharge = data.authorityTypeA.charge;
    let authorityTypeGname = data.authorityTypeG.person;
    let authorityTypeGcharge = data.authorityTypeG.charge;
    const pdf = new jsPDF();
    pdf.setTextColor(12, 13, 14);
    const imgData = logoUnsm;
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "normal");
    let textoCompleto =
        "La Dirección de Asuntos Académicos de la Universidad Nacional de San Martín, " +
        "**CERTIFICA**" +
        " que " +
        "**" +
        student +
        "** " +
        "con código de matrícula " +
        "**" +
        dni +
        "**," +
        " ha realizado estudios en la Facultad de Ciencias de la Salud en el " +
        "**Programa de " +
        program +
        "**," +
        " habiendo aprobado los siguientes cursos:";

    pdf.setFontSize(19);
    pdf.setFont("times", "bold");
    pdf.text(
        "CERTIFICADO DE ESTUDIOS N° " + correlative,
        pageWidth / 2,
        42,
        "center"
    );
    pdf.setLineWidth(0.5);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    let startY = 52;
    let startX = 10;
    const fontSize = 4;
    const lineSpacing = 6;
    const regex = /(\*{2})+/g;
    const textWithoutBoldMarks = textoCompleto.replace(regex, "");
    let splitTextWithoutBoldMarks = pdf.splitTextToSize(
        textWithoutBoldMarks,
        199
    );
    let charsMapLength = 0;
    let position = 0;
    let isBold = false;
    const printCharacters = (
        doc,
        textObject,
        startY,
        startX,
        fontSize,
        lineSpacing
    ) => {
        const startXCached = startX;
        const boldStr = "bold";
        const normalStr = "normal";
        textObject.map((row) => {
            Object.entries(row).map(([key, value]) => {
                pdf.setFont("helvetica", value.bold ? boldStr : normalStr);

                pdf.text(value.char, startX, startY);
                startX = startX + pdf.getStringUnitWidth(value.char) * fontSize;
            });
            startX = startXCached;
            startY += lineSpacing;
        });
    };
    let textRows = splitTextWithoutBoldMarks.map((row, i) => {
        const charsMap = row.split("");
        const chars = charsMap.map((char, j) => {
            position = charsMapLength + j + i;
            let currentChar = textoCompleto.charAt(position);
            if (currentChar === "*") {
                const spyNextChar = textoCompleto.charAt(position + 1);
                if (spyNextChar === "*") {
                    isBold = !isBold;
                    currentChar = textoCompleto.charAt(position + 2);
                    let removeMarks = textoCompleto.split("");
                    removeMarks.splice(position, 2);
                    textoCompleto = removeMarks.join("");
                }
            }
            return { char: currentChar, bold: isBold };
        });
        charsMapLength += charsMap.length;
        return { ...chars };
    });
    printCharacters(pdf, textRows, startY, startX, fontSize, lineSpacing);
    pdf.setFontSize(10);
    pdf.setFont("times", "bold");
    let header = [["ASIGNATURA", "CREDITOS", "CALIFICACIONES", "AÑO"]];
    pdf.autoTable({
        margin: [{ left: 10, right: 10, bottom: 5 }],
        theme: "plain",
        startY: 74,
        tableLineColor: [0, 0, 0],
        tableLineWidth: 1,
        styles: {
            fontSize: 8,
            font: "helvetica",
            lineWidth: 0,
        },
        columnStyles: {
            0: { cellWidth: 123, halign: "rigth" },
            1: { cellWidth: 21.6, halign: "center" },
            2: { cellWidth: 33.2, halign: "rigth" },
            3: { halign: "center" },
        },
        headStyles: {
            fontStyle: "bold",
            font: "helvetica",
            fontSize: 8,
            lineColor: [0, 0, 0],
            lineWidth: 0.5,
        },

        bodyStyles: {
            font: "helvetica",
            fontSize: 7,
        },
        willDrawCell: (data) => {
            if (data.section === "body") {
                let text = String(data.cell.raw);
                if (text.indexOf("CICLO") >= 0) {
                    pdf.setFont("helvetica", "bold");
                    data.cell.text = data.cell.raw;
                }
            }
        },

        head: header,
        body: record,
    });
    let finalTable = pdf.lastAutoTable.finalY + 5;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL DE CREDITOS :", 12, finalTable - 1);
    pdf.text("PROMEDIO PONDERADO :", 140.6, finalTable - 1);
    pdf.text("OBSERVACIONES :", 12, finalTable + 6);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(String(totalCredit), 47, finalTable - 1);
    pdf.text(String(averageScore), 179, finalTable - 1);
    pdf.text(String(observation), 40, finalTable + 6, {
        maxWidth: 158,
        align: "justify",
    });
    pdf.setLineWidth(0.5);
    pdf.line(133, 76, 133, finalTable - 5);
    pdf.line(154.56, 76, 154.56, finalTable - 5);
    pdf.line(187.8, 76, 187.8, finalTable - 5);
    pdf.setLineWidth(1);
    pdf.line(10, finalTable + 2, 200, finalTable + 1);
    pdf.line(10, finalTable + 12, 200, finalTable + 12);
    let falta = 289 - finalTable;
    pdf.line(10, finalTable - 5, 10, finalTable + falta);
    pdf.line(200, finalTable - 5, 200, finalTable + falta);
    pdf.line(10, 288.5, 200, 288.5);
    if (finalTable >= 220) {
        pdf.addPage();
        finalTable = 10;
        pdf.setLineWidth(1);
        pdf.line(10, finalTable - 0.5, 10, finalTable + 70.5);
        pdf.line(200, finalTable - 0.5, 200, finalTable + 70.5);
        pdf.line(10, 10, 200, 10); //1 horizontal
        pdf.line(10, 80, 200, 80);
    }
    let imgUrl = app.server + "photo/" + photo;
    let imgPhoto = await getDataUri(imgUrl);
    pdf.addImage(imgPhoto, "JPEG", 12, finalTable + 25, 33, 40);
    pdf.setLineWidth(0.5);
    pdf.line(12, finalTable + 25, 45, finalTable + 25); //1 horizontal
    pdf.line(12, finalTable + 65, 45, finalTable + 65); //2 horizontal
    pdf.line(12.2, finalTable + 25, 12.2, finalTable + 65); //1 vertical
    pdf.line(44.8, finalTable + 25, 44.8, finalTable + 65); //2 vertical
    pdf.setFontSize(8);
    pdf.text(
        "Así consta en las actas, de la " +
            principalOrganicUnit +
            " a las que me remito en caso necesario.",
        12,
        finalTable + 17
    );
    pdf.setFontSize(10);
    pdf.text(
        "ESCALA DE CALIFICATIVOS: 0-13 Desaprobado, 14-20 Aprobado.",
        12,
        finalTable + 22
    );
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("Tarapoto " + date, 140, finalTable + 22);
    pdf.setFontSize(7);
    pdf.setLineWidth(0.5);
    pdf.line(50, finalTable + 48, 98, finalTable + 48);
    pdf.setFont("helvetica", "bold");
    pdf.text(authorityTypeGname, 50, finalTable + 51);
    pdf.setFont("helvetica", "normal");
    pdf.text(authorityTypeGcharge, 50, finalTable + 53.3);
    pdf.line(130, finalTable + 48, 185, finalTable + 48);
    pdf.setFont("helvetica", "bold");
    pdf.text(authorityTypeAname, 130, finalTable + 51);
    pdf.setFont("helvetica", "normal");
    pdf.text(authorityTypeAcharge, 130, finalTable + 53.3);
    pdf.save("CERTIFICADO-ESTUDIOS-" + student + ".pdf");
};

const pdfReportAutoTableConstancyEntry = async (data) => {
    let student = data.studentData.Person.name;
    let dni = data.studentData.Person.document_number;
    let program = data.studentData.Program.denomination;
    let admissionPlan = data.studentData.Admission_plan.description.substr(16);
    let duration = data.studentData.Admission_plan.duration;
    let dateClass = moment(data.studentData.Admission_plan.date_class).format(
        "LL"
    );
    let sede =
        data.studentData.Program.Organic_unit_register.Campu.denomination;
    let certyDescription = "La oficina de asuntos academicos";
    let authorityTypeGname = data.authorityTypeG.person;
    let authorityTypeGcharge = data.authorityTypeG.charge;

    let correlative = data.correlative;
    let date = data.date;

    let principalOrganicUnit = data.principalOrganicUnit.description;

    const pdf = new jsPDF();
    const imgData = logoUnsm;

    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 13, 14, 28, 28);
    if (entity === 1) {
        pdf.addImage(logoEpg, "JPEG", 168, 14, 28, 28);
    }

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "normal");

    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", pageWidth / 2, 20, "center");

    pdf.setFontSize(18);
    pdf.text(principalOrganicUnit.toUpperCase(), pageWidth / 2, 28, "center");
    pdf.setFontSize(26);
    pdf.setFont("times", "bold");
    pdf.text(
        "CONSTANCIA DE INGRESO" + " N°" + correlative,
        pageWidth / 2,
        60,
        "center"
    );
    pdf.setLineWidth(0.5);
    pdf.line(30, 62, 181, 62);

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        authorityTypeGcharge +
            " " +
            authorityTypeGname +
            " de la Universidad Nacional de San Martín,Tarapoto, hace constar que:",
        20,
        75,
        {
            maxWidth: 170,
            align: "justify",
        }
    );
    pdf.setFontSize(23);
    pdf.setFont("helvetica", "bold");
    pdf.text(student, pageWidth / 2, 105, "center");

    pdf.setFontSize(14);

    pdf.setFont("helvetica", "normal");
    pdf.text(
        "Identificado con DNI N° " +
            dni +
            ", ha sido adminito al programa de estudio de la " +
            program +
            " promoción" +
            admissionPlan +
            ".",
        20,
        130,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    pdf.text(
        "El programa de la " +
            principalOrganicUnit +
            " tendra una duración de " +
            duration +
            " meses el mismo que inicio el " +
            dateClass +
            ".",
        20,
        150,
        {
            maxWidth: 170,
            align: "justify",
        }
    );
    pdf.text(
        "Se extiende la presente constancia a petición del interesado(a) para los fines que considere conveniente.",
        20,
        165,
        {
            maxWidth: 170,
            align: "justify",
        }
    );
    pdf.setFont("helvetica", "bold");
    pdf.text("Tarapoto, " + date, 190, 180, {
        align: "right",
    });

    pdf.text("Atentamente", pageWidth / 2, 200, "center");

    // pdf.setFont('helvetica', "bold");
    // pdf.setFontSize(11);
    // pdf.line(66, 230, 145, 230);
    // pdf.text(authorityTypeGname, pageWidth / 2, 233.5, 'center');
    // pdf.setFont('helvetica', "normal");
    //
    // pdf.text(authorityTypeGcharge, pageWidth / 2, 237, 'center');

    // pdf.setFontSize(7)
    // pdf.setFont("helvetica", "normal");
    // pdf.text(moment().format('HH:mm DD/MM/YYYY '), 181, 65);

    const pageCount = pdf.internal.getNumberOfPages();

    // pdf.setFont('helvetica', 'normal')
    // pdf.setFontSize(8)
    // for (let i = 1; i <= pageCount; i++) {
    //     pdf.setPage(i)
    //     pdf.text('Pag ' + String(i) + ' de ' + String(pageCount), 197, 287, {
    //         align: 'right'
    //     })
    // }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("CONSTANCIA-INGRESO-" + student + ".pdf");
};

const pdfReportAutoTableConstancyExpedito = async (data) => {
    let student = data.studentData.Person.name;
    let dni = data.studentData.Person.document_number;
    let program = data.studentData.Program.denomination;

    let lastRegister = data.lastRegister;

    let date = data.date;

    let principalOrganicUnit = data.principalOrganicUnit.description;

    const pdf = new jsPDF();
    const imgData = logoUnsm;

    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 13, 14, 28, 28);

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "normal");

    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", pageWidth / 2, 20, "center");

    pdf.setFontSize(18);
    pdf.text(principalOrganicUnit.toUpperCase(), pageWidth / 2, 28, "center");
    // pdf.setFontSize(16);
    // pdf.text(principalOrganicUnit, 50, 40);
    // pdf.setFontSize(11);
    // pdf.text('N°' + correlative, 190, 40, {align: 'right'});
    pdf.setFontSize(26);
    pdf.setFont("times", "bold");
    pdf.text("CONSTANCIA DE EXPEDITO", pageWidth / 2, 60, "center");
    pdf.setLineWidth(0.5);
    pdf.line(30, 62, 181, 62);

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        "La Coordinadora de la Unidad de Segunda Especialidad de la Facultad de Ciencias de la Salud Obsta. YNES TORRES FLORES de la Universidad Nacional de San Martín - Tarapoto, hace constar que:",
        20,
        75,
        {
            maxWidth: 170,
            align: "justify",
        }
    );
    pdf.setFontSize(23);
    pdf.setFont("helvetica", "bold");
    pdf.text(student, pageWidth / 2, 105, "center");

    pdf.setFontSize(14);

    pdf.setFont("helvetica", "normal");
    pdf.text(
        "Identificado con DNI N° " +
            dni +
            ",de la Facultad de Ciencias de la Salud en el programa de " +
            program +
            ", ha culminado sus estudios en " +
            lastRegister +
            ", no teniendo deuda académica, económica ni administrativa con la Universidad Nacional de San Martin, por lo que se le declara Expedito para hacer los trámites de titulación respectiva.",
        20,
        130,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    pdf.text(
        "Se extiende la presente constancia a petición del interesado(a) para los fines que considere conveniente.",
        20,
        175,
        {
            maxWidth: 170,
            align: "justify",
        }
    );
    pdf.setFont("helvetica", "bold");
    pdf.text("Tarapoto, " + date, 190, 193, {
        align: "right",
    });

    pdf.text("Atentamente", pageWidth / 2, 210, "center");

    pdf.setFontSize(11);
    pdf.line(66, 240, 145, 240);
    pdf.text("Obsta. YNES TORRES FLORES", pageWidth / 2, 243.5, "center");
    pdf.setFont("helvetica", "normal");

    pdf.text("Coordinadora de la USE", pageWidth / 2, 247, "center");

    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    // pdf.setFont('helvetica', "bold");
    // pdf.setFontSize(11);
    // pdf.line(66, 230, 145, 230);
    // pdf.text(authorityTypeGname, pageWidth / 2, 233.5, 'center');
    // pdf.setFont('helvetica', "normal");
    //
    // pdf.text(authorityTypeGcharge, pageWidth / 2, 237, 'center');

    // pdf.setFontSize(7)
    // pdf.setFont("helvetica", "normal");
    // pdf.text(moment().format('HH:mm DD/MM/YYYY '), 181, 65);

    const pageCount = pdf.internal.getNumberOfPages();

    // pdf.setFont('helvetica', 'normal')
    // pdf.setFontSize(8)
    // for (let i = 1; i <= pageCount; i++) {
    //     pdf.setPage(i)
    //     pdf.text('Pag ' + String(i) + ' de ' + String(pageCount), 197, 287, {
    //         align: 'right'
    //     })
    // }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("CONSTANCIA-EXPEDITO" + student + ".pdf");
};

const pdfReportAutoTableConstancyEntrySeunsm = async (data) => {
    let student = data.studentData.Person.name;
    let codeStudent = data.studentData.Person.document_number;
    let program = data.studentData.Program.denomination;
    let admissionPlan = data.studentData.Admission_plan.description.substr(16);
    let duration = data.studentData.Admission_plan.duration;
    let dateClass = moment(data.studentData.Admission_plan.date_class).format(
        "LL"
    );
    let date = data.date;
    let principalOrganicUnit = data.principalOrganicUnit.description;
    let correlative = data.correlative;

    // GENDER
    let articleGender =
        data.studentData.Person.gender === "Femenino" ? "La" : "El";
    let interestedGender =
        data.studentData.Person.gender === "Femenino"
            ? "de la interesada"
            : "del interesado";
    let aceptedGender =
        data.studentData.Person.gender === "Femenino" ? "admitida" : "admitido";

    const pdf = new jsPDF();
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    pdf.addImage(imgUnsm, "PNG", 20, 10, 24, 24);
    pdf.setFontSize(15);
    pdf.setFont("helvetica", "normal");
    pdf.text(universityName.toUpperCase(), pageWidth / 2, 16, "center");
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "normal");
    pdf.text(facultyName.toUpperCase(), pageWidth / 2, 23, "center");
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(unityName.toUpperCase(), pageWidth / 2, 31, "center");
    pdf.addImage(imgFcs, "PNG", 165, 10, 24, 24);

    pdf.setFontSize(19);
    pdf.setFont("helvetica", "bold");
    pdf.text("CONSTANCIA DE INGRESO", pageWidth / 2, 55, "center");

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        "La Decana de la " +
            facultyName +
            ", de conformidad a lo establecido en el Reglamento de Admisión de la  " +
            unityName +
            " - " +
            facultyName +
            " - " +
            universityName +
            ", expide la presente constancia a:",
        20,
        70,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text(student, pageWidth / 2, 102, "center");

    // pdf.text("a :", 20, 100);
    // pdf.text(student, 27, 100);

    // pdf.text("con código :", 20, 107);
    // pdf.text(codeStudent, 49, 107);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        "Con código N° " +
            codeStudent +
            ", quien ha ocupado una vacante en el Programa de Estudios de " +
            program + ", por la modalidad de EXAMEN ORDINARIO, Proceso de Admisión " + admissionPlan + ".",
        20,
        118,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    // pdf.text(
    //     "Por la modalidad de EXAMEN ORDINARIO, Proceso de Admisión " +
    //         admissionPlan,
    //     20,
    //     141
    // );

    pdf.setFont("helvetica", "bold");
    pdf.text("Tarapoto, " + date, 118, 165);

    pdf.text("Atentamente", pageWidth / 2, 190, "center");

    pdf.line(58, 234, 153, 234);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Obsta. Dra. Evangelina Ampuero Fernández", pageWidth / 2, 238.5, "center");
    pdf.setFont("helvetica", "normal");

    pdf.text("DECANA", pageWidth / 2, 243.5, "center");

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(facultyName, pageWidth / 2, 248.5, "center");

    const pageCount = pdf.internal.getNumberOfPages();

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("CONSTANCIA-INGRESO-" + student + ".pdf");
};

// const pdfReportAutoTableConstancyEntrySeunsm = async (data) => {
//     let student = data.studentData.Person.name;
//     let codeStudent = data.studentData.Person.document_number;
//     let program = data.studentData.Program.denomination;
//     let admissionPlan = data.studentData.Admission_plan.description.substr(16);
//     let duration = data.studentData.Admission_plan.duration;
//     let dateClass = moment(data.studentData.Admission_plan.date_class).format(
//         "LL"
//     );
//     let date = data.date;
//     let principalOrganicUnit = data.principalOrganicUnit.description;
//     let correlative = data.correlative;

//     // GENDER
//     let articleGender =
//         data.studentData.Person.gender === "Femenino" ? "La" : "El";
//     let interestedGender =
//         data.studentData.Person.gender === "Femenino"
//             ? "de la interesada"
//             : "del interesado";
//     let aceptedGender =
//         data.studentData.Person.gender === "Femenino" ? "admitida" : "admitido";

//     const pdf = new jsPDF();
//     const totalPagesExp = "{total_pages_count_string}";
//     let pageWidth = pdf.internal.pageSize.getWidth();
//     pdf.addImage(imgUnsm, "PNG", 20, 10, 24, 24);
//     pdf.setFontSize(15);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(universityName.toUpperCase(), pageWidth / 2, 16, "center");
//     pdf.setFontSize(13);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(facultyName.toUpperCase(), pageWidth / 2, 23, "center");
//     pdf.setFontSize(14);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(unityName.toUpperCase(), pageWidth / 2, 31, "center");
//     pdf.addImage(imgFcs, "PNG", 165, 10, 24, 24);

//     pdf.setFontSize(19);
//     pdf.setFont("helvetica", "bold");
//     pdf.text("CONSTANCIA DE INGRESO", pageWidth / 2, 55, "center");

//     pdf.setFontSize(14);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(
//         "La Comision Especial de Admisión, de conformidad a lo establecido en el Reglamento de Admisión de la " +
//             unityName +
//             " - " +
//             facultyName +
//             " - " +
//             universityName +
//             ", y habiéndose cumplido con los requisitos estipulados, se expide la presente constancia",
//         20,
//         70,
//         {
//             maxWidth: 170,
//             align: "justify",
//         }
//     );

//     // pdf.text(
//     //     "La coordinadora de la " +
//     //         unityName +
//     //         " - " +
//     //         facultyName +
//     //         " - " +
//     //         universityName +
//     //         ", extiende la presente constancia a:",
//     //     20,
//     //     70,
//     //     {
//     //         maxWidth: 170,
//     //         align: "justify",
//     //     }
//     // );

//     // pdf.setFontSize(19);
//     // pdf.setFont("helvetica", "bold");
//     pdf.text("a :", 20, 100);
//     pdf.text(student, 27, 100);

//     pdf.text("con código :", 20, 107);
//     pdf.text(codeStudent, 49, 107);

//     // pdf.setFontSize(19);
//     // pdf.setFont("helvetica", "bold");
//     // let splitTitle = pdf.splitTextToSize(student, 162);
//     // pdf.text(splitTitle, pageWidth / 2, 100, "center");

//     // pdf.setFontSize(14);
//     // pdf.setFont("helvetica", "normal");
//     // pdf.text(
//     //     "Con código (DNI) N° " +
//     //         codeStudent +
//     //         ", ha sido " +
//     //         aceptedGender +
//     //         " al Programa de " +
//     //         program +
//     //         " - Promoción " +
//     //         admissionPlan +
//     //         ". El programa tendrá una duración de " +
//     //         duration +
//     //         " meses, el mismo que inició el " +
//     //         dateClass +
//     //         ".",
//     //     10,
//     //     108,
//     //     {
//     //         maxWidth: 189,
//     //         align: "justify",
//     //     }
//     // );
//     // pdf.text(
//     //     "Se extiende la presente constancia a petición " +
//     //         interestedGender +
//     //         " para los fines que considere conveniente.",
//     //     10,
//     //     138,
//     //     {
//     //         maxWidth: 189,
//     //         align: "justify",
//     //     }
//     // );

//     pdf.text(
//         "Quien ha ocupado una vacante en el Programa de Estudios de " + program,
//         20,
//         120,
//         {
//             maxWidth: 170,
//             align: "justify",
//         }
//     );

//     pdf.text("Por la modalidad de EXAMEN ORDINARIO", 20, 141);

//     pdf.text("En el Proceso de Admisión " + admissionPlan, 20, 150);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("Tarapoto, " + date, 118, 180);

//     pdf.text("Atentamente", pageWidth / 2, 205, "center");

//     pdf.line(58, 249, 153, 249);
//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(11);
//     pdf.text("Obsta. Dra. Rosa Rios Lopez", pageWidth / 2, 253.5, "center");
//     pdf.setFont("helvetica", "normal");

//     pdf.text("COORDINADORA", pageWidth / 2, 258.5, "center");

//     pdf.setFontSize(11);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(unityName + " - FCS - UNSM", pageWidth / 2, 263.5, "center");

//     const pageCount = pdf.internal.getNumberOfPages();

//     // Total page number plugin only available in jspdf v1.0+
//     if (typeof pdf.putTotalPages === "function") {
//         pdf.putTotalPages(totalPagesExp);
//     }

//     pdf.save("CONSTANCIA-INGRESO-" + student + ".pdf");
// };

const pdfReportAutoTableConstancyStudy = async (data) => {
    let student = data.studentData.Person.name;
    let program = data.studentData.Program.denomination;

    let admissionPlan = data.studentData.Admission_plan.description.substr(-7);

    let sede =
        data.studentData.Program.Organic_unit_register.Campu.denomination;
    let ciclo = data.ciclo;
    let authorityTypeGname = data.authorityTypeG.person;
    let authorityTypeGcharge = data.authorityTypeG.charge;

    let correlative = data.correlative;
    let date = data.date;

    let principalOrganicUnit = data.principalOrganicUnit.description;
    let descriptionOrganicUnit = data.principalOrganicUnit.abbreviation;

    const pdf = new jsPDF();
    const imgData = logoUnsm;

    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 13, 14, 28, 28);
    if (entity === 1) {
        pdf.addImage(logoEpg, "JPEG", 168, 14, 28, 28);
    }

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "normal");

    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", pageWidth / 2, 20, "center");

    pdf.setFontSize(18);
    pdf.text(principalOrganicUnit.toUpperCase(), pageWidth / 2, 28, "center");
    // pdf.setFontSize(16);
    // pdf.text(principalOrganicUnit, 50, 40);
    // pdf.setFontSize(11);
    // pdf.text('N°' + correlative, 190, 40, {align: 'right'});
    pdf.setFontSize(26);
    pdf.setFont("times", "bold");
    pdf.text("CONSTANCIA DE ESTUDIO", pageWidth / 2, 60, "center");
    pdf.setLineWidth(0.5);
    pdf.line(45, 62, 165, 62);

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        "El " +
            authorityTypeGcharge +
            " " +
            " de la Universidad Nacional de San Martín - Tarapoto, hace constar que:",
        20,
        75,
        {
            maxWidth: 170,
            align: "justify",
        }
    );
    pdf.setFontSize(23);
    pdf.setFont("helvetica", "bold");
    pdf.text(student, pageWidth / 2, 105, "center");

    pdf.setFontSize(14);

    pdf.setFont("helvetica", "normal");
    pdf.text(
        "Quien, es estudiante del Programa de " +
            program +
            " Promoción " +
            admissionPlan +
            " sede " +
            sede +
            "; actualmente se encuentra cursando el ciclo " +
            ciclo +
            ", en la " +
            descriptionOrganicUnit +
            ".     ",
        20,
        130,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    pdf.text(
        "Se extiende la presente constancia a petición del interesado(a) para los fines que considere conveniente.",
        20,
        160,
        {
            maxWidth: 170,
            align: "justify",
        }
    );
    pdf.setFont("helvetica", "bold");
    pdf.text("Tarapoto, " + date, 190, 180, {
        align: "right",
    });

    pdf.text("Atentamente", pageWidth / 2, 200, "center");

    // pdf.setFont('helvetica', "bold");
    // pdf.setFontSize(11);
    // pdf.line(66, 230, 145, 230);
    // pdf.text(authorityTypeGname, pageWidth / 2, 233.5, 'center');
    // pdf.setFont('helvetica', "normal");
    //
    // pdf.text(authorityTypeGcharge, pageWidth / 2, 237, 'center');

    // pdf.setFontSize(7)
    // pdf.setFont("helvetica", "normal");
    // pdf.text(moment().format('HH:mm DD/MM/YYYY '), 181, 65);

    const pageCount = pdf.internal.getNumberOfPages();

    // pdf.setFont('helvetica', 'normal')
    // pdf.setFontSize(8)
    // for (let i = 1; i <= pageCount; i++) {
    //     pdf.setPage(i)
    //     pdf.text('Pag ' + String(i) + ' de ' + String(pageCount), 197, 287, {
    //         align: 'right'
    //     })
    // }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("CONSTANCIA-ESTUDIOS-" + student + ".pdf");
};

const pdfReportAutoTableConstancyStudySeunsm = async (data) => {
    let student = data.studentData.Person.name;
    let codeStudent = data.studentData.Person.document_number;
    let program = data.studentData.Program.denomination;
    let admissionPlan = data.studentData.Admission_plan.description.substr(-7);
    let sede =
        data.studentData.Program.Organic_unit_register.Campu.denomination;
    let ciclo = data.ciclo;
    let authorityTypeGname = data.authorityTypeG.person;
    let authorityTypeGcharge = data.authorityTypeG.charge;

    let correlative = data.correlative;
    let date = data.date;

    let principalOrganicUnit = data.principalOrganicUnit.description;
    let descriptionOrganicUnit = data.principalOrganicUnit.abbreviation;

    // GENDER
    let articleGender =
        data.studentData.Person.gender === "Femenino" ? "La" : "El";
    let interestedGender =
        data.studentData.Person.gender === "Femenino"
            ? "de la interesada"
            : "del interesado";
    let enrolledGender =
        data.studentData.Person.gender === "Femenino"
            ? "matriculada"
            : "matriculado";

    const pdf = new jsPDF();
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    pdf.addImage(imgUnsm, "PNG", 15, 10, 24, 24);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    pdf.text(universityName.toUpperCase(), pageWidth / 2, 16, "center");
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "normal");
    pdf.text(facultyName.toUpperCase(), pageWidth / 2, 23, "center");
    pdf.setFontSize(15);
    pdf.setFont("helvetica", "normal");
    pdf.text(unityName.toUpperCase(), pageWidth / 2, 31, "center");
    pdf.addImage(imgFcs, "PNG", 170, 10, 24, 24);

    pdf.setFontSize(19);
    pdf.setFont("helvetica", "bold");
    // pdf.text(
    //     "CONSTANCIA DE ESTUDIO N° " + correlative,
    //     pageWidth / 2,
    //     55,
    //     "center"
    // );
    pdf.text("CONSTANCIA DE ESTUDIOS", pageWidth / 2, 55, "center");
    pdf.setLineWidth(0.3);
    pdf.line(15, 57, 195, 57);

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        "La Coordinadora de la " +
            unityName +
            " - " +
            facultyName +
            " - " +
            universityName +
            ", hace constar que:",
        15,
        70,
        {
            maxWidth: 179,
            align: "justify",
        }
    );

    pdf.setFontSize(19);
    pdf.setFont("helvetica", "bold");
    pdf.text("Obsta. " + student, pageWidth / 2, 92, "center");

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        articleGender +
            " estudiante con código (DNI) N° " +
            codeStudent +
            ", actualmente se encuentra " +
            enrolledGender +
            " en el ciclo " +
            ciclo +
            " del Programa de " +
            program +
            " - Promoción " +
            admissionPlan +
            ", sede " +
            sede +
            ".",
        15,
        108,
        {
            maxWidth: 179,
            align: "justify",
        }
    );
    pdf.text(
        "Se extiende la presente constancia a petición " +
            interestedGender +
            " para los fines que considere conveniente.",
        15,
        138,
        {
            maxWidth: 179,
            align: "justify",
        }
    );

    pdf.setFont("helvetica", "bold");
    pdf.text("Tarapoto, " + date, 118, 180);

    pdf.text("Atentamente", pageWidth / 2, 205, "center");

    pdf.line(58, 249, 153, 249);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Obsta. Dra. Rosa Rios Lopez", pageWidth / 2, 253.5, "center");
    pdf.setFont("helvetica", "normal");

    pdf.text("COORDINADORA", pageWidth / 2, 258.5, "center");

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(unityName + " - FCS - UNSM", pageWidth / 2, 263.5, "center");

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("CONSTANCIA-ESTUDIO-" + student + ".pdf");
};

const pdfReportAutoTableConstancyEgress = async (data) => {
    let student = data.studentData.Person.name;
    let firtsRegister = data.firtsRegister;
    let lastRegister = data.lastRegister;

    let program = data.studentData.Program.denomination;

    let admissionPlan = data.studentData.Admission_plan.description.substr(-7);

    let credit = data.studentData.Admission_plan.Plan.credit_required;

    let authorityTypeGname = data.authorityTypeG.person;
    let authorityTypeGcharge = data.authorityTypeG.charge;

    let correlative = data.correlative;
    let date = data.date;

    let principalOrganicUnit = data.principalOrganicUnit.description;

    const pdf = new jsPDF();
    const imgData = logoUnsm;

    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    pdf.addImage(imgData, "JPEG", 13, 14, 28, 28);
    if (entity === 1) {
        pdf.addImage(logoEpg, "JPEG", 168, 14, 28, 28);
    }
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "normal");

    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", pageWidth / 2, 20, "center");

    pdf.setFontSize(18);
    pdf.text(principalOrganicUnit.toUpperCase(), pageWidth / 2, 28, "center");

    pdf.setFontSize(25);
    pdf.setFont("times", "bold");
    pdf.text(
        "CONSTANCIA DE EGRESADO" + " N°" + correlative,
        pageWidth / 2,
        58,
        "center"
    );
    pdf.setLineWidth(0.5);
    pdf.line(18, 59, 193, 59);

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        "El " +
            authorityTypeGcharge +
            " de la Universidad Nacional de San Martín - Tarapoto, hace constar que:",
        20,
        75,
        {
            maxWidth: 170,
            align: "justify",
        }
    );
    pdf.setFontSize(23);
    pdf.setFont("helvetica", "bold");
    pdf.text(student, pageWidth / 2, 105, "center");

    pdf.setFontSize(14);

    pdf.setFont("helvetica", "normal");
    pdf.text(
        "Ha culminado sus estudios en el programa de " +
            program +
            " - Promoción " +
            admissionPlan +
            ", con un total de " +
            credit +
            " créditos de acuerdo a las" +
            " Normas y Reglamentos de la " +
            principalOrganicUnit +
            " de la Universidad Nacional de San Martín.",
        20,
        130,
        {
            maxWidth: 170,
            align: "justify",
        }
    );
    pdf.text(
        "La cual inició el " + firtsRegister + " y culminó el " + lastRegister,
        20,
        165,
        {
            maxWidth: 170,
            align: "justify",
        }
    );
    pdf.text(
        "Se extiende la presente constancia a petición del interesado(a) para los fines que considere conveniente.",
        20,
        180,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    pdf.setFont("helvetica", "bold");
    pdf.text("Tarapoto, " + date, 190, 205, {
        align: "right",
    });

    pdf.text("Atentamente", pageWidth / 2, 225, "center");

    const pageCount = pdf.internal.getNumberOfPages();

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("CONSTANCIA-EGRESO-" + student + ".pdf");
};

// const pdfReportAutoTableConstancyEgressSeunsm = async (data) => {
//     let student = data.studentData.Person.name;
//     let firtsRegister = data.firtsRegister;
//     let lastRegister = data.lastRegister;
//     let dni = data.studentData.Person.document_number;
//     let program = data.studentData.Program.denomination;

//     let admissionPlan = data.studentData.Admission_plan.description.substr(-7);

//     let credit = data.studentData.Admission_plan.Plan.credit_required;

//     let correlative = data.correlative
//     let date = data.date

//     let principalOrganicUnit = data.principalOrganicUnit.description;

//     const pdf = new jsPDF();
//     const imgData = logoUnsm;

//     const totalPagesExp = '{total_pages_count_string}';
//     let pageWidth = pdf.internal.pageSize.getWidth();
//     // let pageHeight = pdf.internal.pageSize.getHeight();
//     pdf.addImage(imgData, 'JPEG', 13, 14, 28, 28);

//     pdf.setFontSize(18);
//     pdf.setFont('helvetica', 'normal');

//     pdf.text('UNIVERSIDAD NACIONAL DE SAN MARTÍN', pageWidth / 2, 20, 'center');

//     pdf.setFontSize(18);
//     pdf.text(principalOrganicUnit.toUpperCase(), pageWidth / 2, 28, 'center');
//     // pdf.text('N° 1', 190, 40, {align: 'right'});

//     // pdf.setFontSize(11);
//     // pdf.text('N°' + correlative, 190, 40, {align: 'right'});
//     pdf.setFontSize(25);
//     pdf.setFont("times", "bold");
//     pdf.text("CONSTANCIA DE EGRESADO" + ' N°' + correlative, pageWidth / 2, 58, 'center');
//     pdf.setLineWidth(0.5);
//     pdf.line(18, 59, 193, 59);

//     pdf.setFontSize(14);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text('La Coordinadora de la Unidad de Segunda Especialidad de la Facultad de Ciencias de la Salud Obsta. YNES TORRES FLORES de la Universidad Nacional de San Martín, hace constar que:', 20, 75, {
//         maxWidth: 170, align: 'justify'
//     });
//     pdf.setFontSize(21);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Obsta. ' + student, pageWidth / 2, 105, 'center');

//     pdf.setFontSize(14);

//     pdf.setFont('helvetica', 'normal');
//     pdf.text('Ha culminado sus estudios en el programa de ' + program + ' - Promoción ' + admissionPlan + ', con un total de ' + credit + ' créditos de acuerdo a las normas y reglamentos de la Unidad de Segunda Especialidad de la Universidad Nacional de San Martin.', 20, 130, {
//         maxWidth: 170, align: 'justify'
//     });
//     pdf.text('Fecha inicio ' + firtsRegister + ' ; fecha fin ' + lastRegister, 20, 165, {
//         maxWidth: 170, align: 'justify'
//     });
//     pdf.text('Se extiende la presente constancia a petición del interesado(a) para los fines que considere conveniente.', 20, 180, {
//         maxWidth: 170, align: 'justify'
//     });

//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Tarapoto, ' + date, 190, 205, {
//         align: 'right'
//     });

//     pdf.text('Atentamente', pageWidth / 2, 225, 'center');

//     pdf.setFont('helvetica', "bold");
//     pdf.setFontSize(11);
//     pdf.line(66, 250, 145, 250);
//     pdf.text('Obsta. YNES TORRES FLORES', pageWidth / 2, 253.5, 'center');
//     pdf.setFont('helvetica', "normal");

//     pdf.text('Coordinadora de la USE', pageWidth / 2, 257, 'center');

//     pdf.setFontSize(7)
//     pdf.setFont("helvetica", "normal");
//     // pdf.text(moment().format('HH:mm DD/MM/YYYY '), 181, 65);

//     // pdf.setFont('helvetica', 'normal')
//     // pdf.setFontSize(8)
//     // for (let i = 1; i <= pageCount; i++) {
//     //     pdf.setPage(i)
//     //     pdf.text('Pag ' + String(i) + ' de ' + String(pageCount), 197, 287, {
//     //         align: 'right'
//     //     })
//     // }

// // Total page number plugin only available in jspdf v1.0+
//     if (typeof pdf.putTotalPages === 'function') {
//         pdf.putTotalPages(totalPagesExp)
//     }

//     pdf.save('CONSTANCIA-EGRESO-' + student + '.pdf');

// };

const pdfReportAutoTableConstancyEgressSeunsm = async (data) => {
    let student = data.studentData.Person.name;
    // let firtsRegister = data.firtsRegister;
    // let lastRegister = data.lastRegister;
    let codeStudent = data.studentData.Person.document_number;
    let program = data.studentData.Program.denomination;
    let admissionPlan = data.studentData.Admission_plan.description.substr(-7);
    let credit = data.studentData.Admission_plan.Plan.credit_required;
    // let correlative = data.correlative;
    let date = data.date;
    // let principalOrganicUnit = data.principalOrganicUnit.description;

    let calendarYear =
        data.studentLatestRegister.Academic_semester.Academic_calendar.denomination.split(
            " "
        )[2];
    let semesterOrder =
        data.studentLatestRegister.Academic_semester.denomination.split(" ")[1];
    let studentLatestRegister = calendarYear + "-" + semesterOrder;

    // GENDER
    let articleGender =
        data.studentData.Person.gender === "Femenino" ? "La" : "El";
    let interestedGender =
        data.studentData.Person.gender === "Femenino"
            ? "de la interesada"
            : "del interesado";

    const pdf = new jsPDF();
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    pdf.addImage(imgUnsm, "PNG", 15, 10, 24, 24);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    pdf.text(universityName.toUpperCase(), pageWidth / 2, 16, "center");
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "normal");
    pdf.text(facultyName.toUpperCase(), pageWidth / 2, 23, "center");
    pdf.setFontSize(15);
    pdf.setFont("helvetica", "normal");
    pdf.text(unityName.toUpperCase(), pageWidth / 2, 31, "center");
    pdf.addImage(imgFcs, "PNG", 170, 10, 24, 24);

    pdf.setFontSize(19);
    pdf.setFont("helvetica", "bold");
    pdf.text("CONSTANCIA DE EGRESADO", pageWidth / 2, 50, "center");
    // pdf.text(
    //     "CONSTANCIA DE EGRESO N° " + correlative,
    //     pageWidth / 2,
    //     50,
    //     "center"
    // );
    pdf.setLineWidth(0.3);
    pdf.line(15, 52, 195, 52);

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        "La Coordinadora de la " +
            unityName +
            " - " +
            facultyName +
            " - " +
            universityName +
            ", hace constar que:",
        15,
        65,
        {
            maxWidth: 179,
            align: "justify",
        }
    );

    pdf.setFontSize(19);
    pdf.setFont("helvetica", "bold");
    pdf.text("Obsta. " + student, pageWidth / 2, 88, "center");

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        articleGender +
            " estudiante con código (DNI) N° " +
            codeStudent +
            ", ha culminado sus estudios en el Programa de " +
            program +
            ", en el periodo " +
            studentLatestRegister +
            ", con un total de " +
            credit +
            " créditos de acuerdo a las Normas y Reglamentos de la " +
            unityName +
            " - " +
            facultyName +
            " - " +
            universityName +
            ". Encontrándose en condición de EGRESADO.",
        15,
        103,
        {
            maxWidth: 179,
            align: "justify",
        }
    );
    // pdf.text(
    //     "Fecha inicio: " + firtsRegister + "; Fecha fin: " + lastRegister,
    //     10,
    //     140,
    //     {
    //         maxWidth: 189,
    //         align: "justify",
    //     }
    // );
    pdf.text(
        "Se extiende la presente constancia a petición " +
            interestedGender +
            " para los fines que considere conveniente.",
        15,
        147,
        {
            maxWidth: 179,
            align: "justify",
        }
    );

    pdf.setFont("helvetica", "bold");
    pdf.text("Tarapoto, " + date, 118, 185);

    pdf.text("Atentamente", pageWidth / 2, 210, "center");

    pdf.line(58, 249, 153, 249);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Obsta. Dra. Rosa Rios Lopez", pageWidth / 2, 253.5, "center");
    pdf.setFont("helvetica", "normal");

    pdf.text("COORDINADORA", pageWidth / 2, 258.5, "center");

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(unityName + " - FCS - UNSM", pageWidth / 2, 263.5, "center");

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("CONSTANCIA-EGRESO-" + student + ".pdf");
};

const pdfReportAutoTableConstancyRegistration = async (data) => {
    let student = data.studentData.Person.name;
    let firtsRegister = moment(
        data.studentData.Admission_plan.date_class
    ).format("DD-MM-YYYY ");

    let program = data.studentData.Program.denomination;
    let admissionPlan = data.studentData.Admission_plan.description.substr(-7);

    let correlative = data.correlative;
    let date = data.date;

    let principalOrganicUnit = data.principalOrganicUnit.description;
    let authorityTypeG = data.authorityTypeG.charge;

    const pdf = new jsPDF();
    const imgData = logoUnsm;
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 13, 14, 28, 28);
    if (entity === 1) {
        pdf.addImage(logoEpg, "JPEG", 168, 14, 28, 28);
    }
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "normal");

    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", pageWidth / 2, 20, "center");

    pdf.setFontSize(18);
    pdf.text(principalOrganicUnit.toUpperCase(), pageWidth / 2, 28, "center");
    // pdf.text('N° 1', 190, 40, {align: 'right'});

    // pdf.setFontSize(11);
    // pdf.text('N°' + correlative, 190, 40, {align: 'right'});
    pdf.setFontSize(24.2);
    pdf.setFont("times", "bold");
    pdf.text(
        "CONSTANCIA DE MATRÍCULA" + " N°" + correlative,
        pageWidth / 2,
        58,
        "center"
    );
    pdf.setLineWidth(0.5);
    pdf.line(18, 59, 193, 59);

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        "El " +
            authorityTypeG +
            " de la Universidad Nacional de San Martín - Tarapoto, hace constar que:",
        20,
        75,
        {
            maxWidth: 170,
            align: "justify",
        }
    );
    pdf.setFontSize(23);
    pdf.setFont("helvetica", "bold");
    pdf.text(student, pageWidth / 2, 105, "center");

    pdf.setFontSize(14);

    pdf.setFont("helvetica", "normal");
    pdf.text(
        "Se encuentra Matrículado en el programa de " +
            program +
            " - Promoción " +
            admissionPlan +
            ", la primera matrícula registra " +
            firtsRegister,
        20,
        130,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    pdf.text(
        "Se extiende la presente constancia a petición del interesado(a) para los fines que considere conveniente.",
        20,
        160,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    pdf.setFont("helvetica", "bold");
    pdf.text("Tarapoto, " + date, 190, 180, {
        align: "right",
    });

    pdf.text("Atentamente", pageWidth / 2, 200, "center");

    // pdf.setFont('helvetica', "bold");
    // pdf.setFontSize(11);
    // pdf.line(66, 230, 145, 230);
    // pdf.text(authorityTypeGname, pageWidth / 2, 233.5, 'center');
    // pdf.setFont('helvetica', "normal");
    //
    // pdf.text(authorityTypeGcharge, pageWidth / 2, 237, 'center');

    // pdf.setFontSize(7)
    // pdf.setFont("helvetica", "normal");
    // pdf.text(moment().format('HH:mm DD/MM/YYYY '), 181, 65);

    const pageCount = pdf.internal.getNumberOfPages();

    // pdf.setFont('helvetica', 'normal')
    // pdf.setFontSize(8)
    // for (let i = 1; i <= pageCount; i++) {
    //     pdf.setPage(i)
    //     pdf.text('Pag ' + String(i) + ' de ' + String(pageCount), 197, 287, {
    //         align: 'right'
    //     })
    // }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("CONSTANCIA-MATRÍCULA-" + student + ".pdf");
};

const pdfReportAutoTableConstancyAdeudar = async (data) => {
    let student = data.studentData.Person.name;
    let firtsRegister = data.firtsRegister;
    let lastRegister = data.lastRegister;
    let dni = data.studentData.Person.document_number;
    let program = data.studentData.Program.denomination;
    let admissionPlan = data.studentData.Admission_plan.description.substr(-7);

    let credit = data.studentData.Admission_plan.Plan.credit_required;
    let organicAbreviation = data.principalOrganicUnit.abbreviation;
    let authorityTypeGname = data.authorityTypeG.person;
    let authorityTypeGcharge = data.authorityTypeG.charge;

    let correlative = data.correlative;
    let date = data.date;

    let principalOrganicUnit = data.principalOrganicUnit.description;

    const pdf = new jsPDF();
    const imgData = logoUnsm;

    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 13, 14, 28, 28);
    if (entity === 1) {
        pdf.addImage(logoEpg, "JPEG", 168, 14, 28, 28);
    }
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "normal");

    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", pageWidth / 2, 20, "center");

    pdf.setFontSize(18);
    pdf.text(principalOrganicUnit.toUpperCase(), pageWidth / 2, 28, "center");
    // pdf.text('N° 1', 190, 40, {align: 'right'});

    // pdf.setFontSize(11);
    // pdf.text('N°' + correlative, 190, 40, {align: 'right'});
    pdf.setFontSize(20);
    pdf.setFont("times", "bold");
    pdf.text("CONSTANCIA DE NO ADEUDAR BIENES ", pageWidth / 2, 51, "center");
    pdf.text(
        "NI RECURSOS ECONOMICOS N° " + correlative,
        pageWidth / 2,
        58,
        "center"
    );
    pdf.setLineWidth(0.5);
    pdf.line(35, 59, 175, 59);

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        "El " +
            authorityTypeGcharge +
            " de la Universidad Nacional de San Martín - Tarapoto, hace constar que:",
        20,
        75,
        {
            maxWidth: 170,
            align: "justify",
        }
    );
    pdf.setFontSize(23);
    pdf.setFont("helvetica", "bold");
    pdf.text(student, pageWidth / 2, 105, "center");

    pdf.setFontSize(14);

    pdf.setFont("helvetica", "normal");
    pdf.text(
        "Egresado(a) de la " +
            organicAbreviation +
            " en el Programa de " +
            program +
            " - Promoción " +
            admissionPlan +
            ", No adeuda bienes, ni recursos económicos a la Universidad Nacional de San Martín.",
        20,
        130,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    pdf.text(
        "Se extiende la presente constancia a petición del interesado(a) para los fines que considere conveniente.",
        20,
        160,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    pdf.setFont("helvetica", "bold");
    pdf.text("Tarapoto, " + date, 190, 190, {
        align: "right",
    });

    pdf.text("Atentamente", pageWidth / 2, 210, "center");

    //
    // pdf.setFont('helvetica', "bold");
    // pdf.setFontSize(11);
    // pdf.line(66, 230, 145, 230);
    // pdf.text(authorityTypeGname, pageWidth / 2, 233.5, 'center');
    // pdf.setFont('helvetica', "normal");
    //
    // pdf.text(authorityTypeGcharge, pageWidth / 2, 237, 'center');

    // pdf.setFontSize(7)
    // pdf.setFont("helvetica", "normal");
    // pdf.text(moment().format('HH:mm DD/MM/YYYY '), 181, 65);

    const pageCount = pdf.internal.getNumberOfPages();

    // pdf.setFont('helvetica', 'normal')
    // pdf.setFontSize(8)
    // for (let i = 1; i <= pageCount; i++) {
    //     pdf.setPage(i)
    //     pdf.text('Pag ' + String(i) + ' de ' + String(pageCount), 197, 287, {
    //         align: 'right'
    //     })
    // }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("CONSTANCIA-DE-NO-ADEUDAR-" + student + ".pdf");
};

const pdfReportAutoTableConstancyOrdenMerito = async (data) => {
    let student = data.studentData.Person.name;
    let studentState = data.studentData.type;
    let studentTotal = data.total;

    let dni = data.studentData.Person.document_number;
    let program = data.studentData.Program.denomination;
    let admissionPlan = data.studentData.Admission_plan.description.substr(-7);
    let studentPonderado = data.ponderado;
    let meritoStudent =
        data.meritoStudent !== ""
            ? " ,el cual le permitió ubicarse en el " + data.meritoStudent
            : "";
    let position = data.positionStudent;
    let principalOrganicUnit = data.principalOrganicUnit.description;
    let organicAbreviation = data.principalOrganicUnit.abbreviation;
    let authorityTypeGcharge = data.authorityTypeG.charge;

    let correlative = data.correlative;
    let date = data.date;

    const pdf = new jsPDF();
    const imgData = logoUnsm;

    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 13, 14, 28, 28);
    if (entity === 1) {
        pdf.addImage(logoEpg, "JPEG", 168, 14, 28, 28);
    }
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "normal");

    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", pageWidth / 2, 20, "center");

    pdf.setFontSize(18);

    pdf.text(principalOrganicUnit.toUpperCase(), pageWidth / 2, 28, "center");
    // pdf.text('N° 1', 190, 40, {align: 'right'});

    // pdf.setFontSize(11);
    // pdf.text('N°' + correlative, 190, 40, {align: 'right'});
    pdf.setFontSize(24.2);
    pdf.setFont("times", "bold");
    pdf.text("CONSTANCIA DE ORDEN DE ", pageWidth / 2, 51, "center");
    pdf.text("MERITO N° " + correlative, pageWidth / 2, 58.2, "center");
    pdf.setLineWidth(0.5);
    pdf.line(45, 59, 165, 59);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        "El " +
            authorityTypeGcharge +
            " de la Universidad Nacional de San Martín, hace constar que:",
        20,
        75,
        {
            maxWidth: 170,
            align: "justify",
        }
    );
    pdf.setFontSize(23);
    pdf.setFont("helvetica", "bold");
    pdf.text(student, pageWidth / 2, 105, "center");

    pdf.setFontSize(14);

    pdf.setFont("helvetica", "normal");
    pdf.text(
        studentState +
            " del Programa de " +
            program +
            " - Promoción " +
            admissionPlan +
            " ,obtuvo un promedio ponderado acumulado de " +
            studentPonderado +
            ", ocupando el puesto número " +
            position +
            "° de " +
            studentTotal +
            " estudiantes" +
            meritoStudent +
            ".",
        20,
        130,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    pdf.text(
        "Se extiende la presente constancia a petición del interesado(a) para los fines que considere conveniente.",
        20,
        160,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    pdf.setFont("helvetica", "bold");
    pdf.text("Tarapoto, " + date, 190, 190, {
        align: "right",
    });

    pdf.text("Atentamente", pageWidth / 2, 210, "center");

    //
    // pdf.setFont('helvetica', "bold");
    // pdf.setFontSize(11);
    // pdf.line(66, 230, 145, 230);
    // pdf.text(authorityTypeGname, pageWidth / 2, 233.5, 'center');
    // pdf.setFont('helvetica', "normal");
    //
    // pdf.text(authorityTypeGcharge, pageWidth / 2, 237, 'center');

    // pdf.setFontSize(7)
    // pdf.setFont("helvetica", "normal");
    // pdf.text(moment().format('HH:mm DD/MM/YYYY '), 181, 65);

    const pageCount = pdf.internal.getNumberOfPages();

    // pdf.setFont('helvetica', 'normal')
    // pdf.setFontSize(8)
    // for (let i = 1; i <= pageCount; i++) {
    //     pdf.setPage(i)
    //     pdf.text('Pag ' + String(i) + ' de ' + String(pageCount), 197, 287, {
    //         align: 'right'
    //     })
    // }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("CONSTANCIA-DE-ORDEN-DE-MERITO-" + student + ".pdf");
};

const pdfReportLiquidationByAdmissionPlan = async (data) => {
    console.log(data);
    let student = "";
    let firtsRegister = "";
    let totalInscription = data.totalInscription.toFixed(2),
        totalRegistration = data.totalRegistration.toFixed(2),
        totalPension = data.totalPension.toFixed(2),
        totalOther = data.totalOther.toFixed(2),
        subTotalEntry = data.subTotalEntry.toFixed(2),
        egressServiceMaterial = data.egressServiceMaterial.toFixed(2),
        egressTeacher = data.egressTeacher.toFixed(2),
        egressAdministrative = data.egressAdministrative.toFixed(2),
        subTotalEgress = data.subTotalEgress.toFixed(2),
        netIncome = data.netIncome.toFixed(2),
        unsmPercent = data.unsmPercent.toFixed(2),
        total = data.total.toFixed(2),
        dateGenerate = data.dateGenerate,
        sede =
            data.dataInformation.Program.Organic_unit_register.Campu.denomination.toUpperCase(),
        program = data.dataInformation.Program.denomination,
        admissionPlan = data.dataInformation.description;

    let principalOrganicUnit = data.principalOrganicUnit.description;

    const pdf = new jsPDF();
    const imgData = logoUnsm;

    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 13, 14, 28, 28);
    if (entity === 1) {
        pdf.addImage(logoEpg, "JPEG", 168, 14, 28, 28);
    }
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "normal");

    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", pageWidth / 2, 20, "center");

    pdf.setFontSize(18);
    pdf.text(mastePosgrade.toUpperCase(), pageWidth / 2, 28, "center");
    // pdf.text('N° 1', 190, 40, {align: 'right'});
    let axisY = 59;
    // pdf.setFontSize(11);
    // pdf.text('N°' + correlative, 190, 40, {align: 'right'});
    pdf.setFontSize(20);
    pdf.setLineWidth(0.5);
    pdf.setFont("helvetica", "bold");

    pdf.line(15.25, 52, 15.35, 186);
    pdf.line(199.75, 52, 199.75, 186);

    pdf.line(15, 52, 200, 52);
    pdf.text("RESUMEN FINANCIERO", pageWidth / 2, axisY, "center");
    pdf.setFontSize(12);
    pdf.text(program, pageWidth / 2, axisY + 7, "center");

    pdf.line(15, axisY + 2, 200, axisY + 2);
    pdf.line(15, axisY + 9, 200, axisY + 9);

    pdf.text(
        admissionPlan + "  " + sede,
        pageWidth / 2,
        axisY + 13.5,
        "center"
    );
    pdf.line(15, axisY + 15, 200, axisY + 15);
    pdf.setFontSize(13);
    pdf.text("INGRESOS", 18, axisY + 19.5);
    pdf.line(15, axisY + 21, 200, axisY + 21);
    pdf.setFontSize(12);
    //pdf.text("CONCEPTO", 18, axisY + 26);

    //pdf.text("INGRESO BRUTO", 160, axisY + 26);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("INSCRIPCCIÓN", 18, axisY + 32);
    pdf.text("MATRÍCULA", 18, axisY + 37);
    pdf.text("PENSIÓN DE ENSEÑANZA", 18, axisY + 42);
    pdf.text("OTROS CONCEPTOS", 18, axisY + 47);
    pdf.setFontSize(11);

    //INGRESO BRUTO
    pdf.setFont("helvetica", "normal");
    pdf.text("S/ " + totalInscription, 160, axisY + 32);
    pdf.text("S/ " + totalRegistration, 160, axisY + 37);
    pdf.text("S/ " + totalPension, 160, axisY + 42);
    pdf.text("S/ " + totalOther, 160, axisY + 47);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("INGRESO BRUTO (A)", 18, axisY + 57);
    pdf.text("S/ " + subTotalEntry, 160, axisY + 57);
    pdf.line(15, axisY + 61, 200, axisY + 61);
    const pageCount = pdf.internal.getNumberOfPages();
    //////////////////////////////////
    //////////////////////////////////
    //////////////////////////////////

    pdf.setFontSize(13);
    pdf.text("EGRESOS", 18, axisY + 66);
    pdf.line(15, axisY + 67.5, 200, axisY + 67.5);
    pdf.setFontSize(12);
    //pdf.text("CONCEPTO", 18, axisY + 72);
    //pdf.text("EGRESO BRUTO", 160, axisY + 72);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("PAGO ADMINISTRATIVO", 18, axisY + 78);
    pdf.text("PAGO DOCENTE", 18, axisY + 83);
    pdf.text("PAGO MATERIALES", 18, axisY + 88);

    pdf.setFontSize(11);
    //EGRESO BRUTO
    pdf.text("S/ " + egressAdministrative, 160, axisY + 78);
    pdf.text("S/ " + egressTeacher, 160, axisY + 83);
    pdf.text("S/ " + egressServiceMaterial, 160, axisY + 88);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("EGRESO BRUTO (B)", 18, axisY + 98);
    pdf.text("S/ " + subTotalEgress, 160, axisY + 98);

    pdf.setFontSize(11);

    //INGRESO BRUTO

    pdf.line(15, axisY + 102, 200, axisY + 102);
    pdf.setFontSize(13);
    pdf.text("INGRESOS NETOS A-B ", 18, axisY + 110);
    pdf.text("S/ " + netIncome, 160, axisY + 110);

    pdf.text("37% UNSM ", 18, axisY + 115);
    pdf.text("S/ " + unsmPercent, 160, axisY + 115);
    pdf.setFontSize(14);
    pdf.text("DISPONIBLE ", 18, axisY + 124);
    pdf.setFontSize(15);
    pdf.text("S/" + total, 160, axisY + 124);

    pdf.line(15, axisY + 127, 200, axisY + 127);

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("Reporte.pdf");
};

const pdfReportAutoTableConstancyAdeudarSeunsm = async (data) => {
    let student = data.studentData.Person.name;
    let firtsRegister = data.firtsRegister;
    let lastRegister = data.lastRegister;
    let dni = data.studentData.Person.document_number;
    let program = data.studentData.Program.denomination;
    let admissionPlan = data.studentData.Admission_plan.description.substr(-7);

    let credit = data.studentData.Admission_plan.Plan.credit_required;
    let organicAbreviation = data.principalOrganicUnit.abbreviation;
    let authorityTypeGname = data.authorityTypeG.person;
    let authorityTypeGcharge = data.authorityTypeG.charge;

    let correlative = data.correlative;
    let date = data.date;

    let principalOrganicUnit = data.principalOrganicUnit.description;

    const pdf = new jsPDF();
    const imgData = logoUnsm;

    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 13, 14, 28, 28);

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "normal");

    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", pageWidth / 2, 20, "center");

    pdf.setFontSize(18);
    pdf.text(principalOrganicUnit.toUpperCase(), pageWidth / 2, 28, "center");
    // pdf.text('N° 1', 190, 40, {align: 'right'});

    // pdf.setFontSize(11);
    // pdf.text('N°' + correlative, 190, 40, {align: 'right'});
    pdf.setFontSize(20);
    pdf.setFont("times", "bold");
    pdf.text("CONSTANCIA DE NO ADEUDAR BIENES", pageWidth / 2, 51, "center");
    pdf.text("NI RECURSOS ECONOMICOS", pageWidth / 2, 58, "center");
    pdf.setLineWidth(0.5);
    pdf.line(35, 59, 175, 59);

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        "La Coordinadora de la Unidad de Segunda Especialidad de la Facultad de Ciencias de la Salud Obsta. YNES TORRES FLORES de la Universidad Nacional de San Martín - Tarapoto, hace constar que:",
        20,
        75,
        {
            maxWidth: 170,
            align: "justify",
        }
    );
    pdf.setFontSize(21);
    pdf.setFont("helvetica", "bold");
    pdf.text("Obsta. " + student, pageWidth / 2, 105, "center");

    pdf.setFontSize(14);

    pdf.setFont("helvetica", "normal");
    pdf.text(
        "Egresado(a) de la " +
            organicAbreviation +
            " en el Programa de " +
            program +
            " - Promoción " +
            admissionPlan +
            ", no adeuda bienes, ni recursos económicos a la Universidad Nacional de San Martin.",
        20,
        130,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    pdf.text(
        "Se extiende la presente constancia a petición del interesado(a) para los fines que considere conveniente.",
        20,
        160,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    pdf.setFont("helvetica", "bold");
    pdf.text("Tarapoto, " + date, 190, 190, {
        align: "right",
    });

    pdf.text("Atentamente", pageWidth / 2, 210, "center");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.line(66, 240, 145, 240);
    pdf.text("Obsta. YNES TORRES FLORES", pageWidth / 2, 243.5, "center");
    pdf.setFont("helvetica", "normal");

    pdf.text("Coordinadora de la USE", pageWidth / 2, 247, "center");

    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");

    const pageCount = pdf.internal.getNumberOfPages();

    // pdf.setFont('helvetica', 'normal')
    // pdf.setFontSize(8)
    // for (let i = 1; i <= pageCount; i++) {
    //     pdf.setPage(i)
    //     pdf.text('Pag ' + String(i) + ' de ' + String(pageCount), 197, 287, {
    //         align: 'right'
    //     })
    // }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("CONSTANCIA-DE-NO-ADEUDAR-" + student + ".pdf");
};

const pdfReportAutoTableConstancyDisciplinarySeunsm = async (data) => {
    let student = data.studentData.Person.name;
    let firtsRegister = data.firtsRegister;
    let lastRegister = data.lastRegister;
    let dni = data.studentData.Person.document_number;
    let program = data.studentData.Program.denomination;
    let admissionPlan = data.studentData.Admission_plan.description.substr(-7);

    let credit = data.studentData.Admission_plan.Plan.credit_required;
    let organicAbreviation = data.principalOrganicUnit.abbreviation;
    let authorityTypeGname = data.authorityTypeG.person;
    let authorityTypeGcharge = data.authorityTypeG.charge;

    let correlative = data.correlative;
    let date = data.date;

    let principalOrganicUnit = data.principalOrganicUnit.description;

    const pdf = new jsPDF();
    const imgData = logoUnsm;

    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 13, 14, 28, 28);

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "normal");

    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", pageWidth / 2, 20, "center");

    pdf.setFontSize(18);
    pdf.text(principalOrganicUnit.toUpperCase(), pageWidth / 2, 28, "center");
    // pdf.text('N° 1', 190, 40, {align: 'right'});

    // pdf.setFontSize(11);
    // pdf.text('N°' + correlative, 190, 40, {align: 'right'});
    pdf.setFontSize(20);
    pdf.setFont("times", "bold");
    pdf.text("CONSTANCIA DE NO HABER SIDO ", pageWidth / 2, 51, "center");
    pdf.text("SOMETIDO A REGIMEN DISCIPLINARIO", pageWidth / 2, 58, "center");
    pdf.setLineWidth(0.5);
    pdf.line(35, 59, 175, 59);

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        "La Coordinadora de la Unidad de Segunda Especialidad de la Facultad de Ciencias de la Salud Obsta. YNES TORRES FLORES de la Universidad Nacional de San Martín - Tarapoto, hace constar que:",
        20,
        75,
        {
            maxWidth: 170,
            align: "justify",
        }
    );
    pdf.setFontSize(23);
    pdf.setFont("helvetica", "bold");
    pdf.text("Obsta. " + student, pageWidth / 2, 105, "center");

    pdf.setFontSize(14);

    pdf.setFont("helvetica", "normal");
    pdf.text(
        "Que, la ex estudiante del Programa de " +
            program +
            " - La cual inicio el Semestre " +
            firtsRegister +
            " y culminó el Semestre " +
            lastRegister +
            ", durante su permanencia en esta casa Superior de Estudios no ha sido separada por medidas disciplinarias; como consta en los archivos correspondientes.",
        20,
        130,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    pdf.text(
        "Se extiende la presente constancia a petición del interesado(a) para los fines que considere conveniente.",
        20,
        170,
        {
            maxWidth: 170,
            align: "justify",
        }
    );

    pdf.setFont("helvetica", "bold");
    pdf.text("Tarapoto, " + date, 190, 190, {
        align: "right",
    });

    pdf.text("Atentamente", pageWidth / 2, 210, "center");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.line(66, 240, 145, 240);
    pdf.text("Obsta. YNES TORRES FLORES", pageWidth / 2, 243.5, "center");
    pdf.setFont("helvetica", "normal");

    pdf.text("Coordinadora de la USE", pageWidth / 2, 247, "center");

    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");

    const pageCount = pdf.internal.getNumberOfPages();

    // pdf.setFont('helvetica', 'normal')
    // pdf.setFontSize(8)
    // for (let i = 1; i <= pageCount; i++) {
    //     pdf.setPage(i)
    //     pdf.text('Pag ' + String(i) + ' de ' + String(pageCount), 197, 287, {
    //         align: 'right'
    //     })
    // }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("CONSTANCIA-DISCIPLINARIA-" + student + ".pdf");
};

const pdfReportAutoTableRercordAcademic = async (data) => {
    let principalOrganicUnit = data.principalOrganicUnit.description,
        person = data.studentData.Person.name,
        personDocument = data.studentData.Person.document_number,
        registration = data.registration,
        program = data.studentData.Program.denomination,
        sedeRegistration =
            data.studentData.Program.Organic_unit_register.Campu.denomination.toUpperCase(),
        unitRegistration =
            data.studentData.Program.Organic_unit_register.denomination.toUpperCase(),
        // MPT
        admissionPlan = data.studentData.Admission_plan.description;

    let pagesGenerate = Math.ceil(registration.length / 3);

    function splitArray(arr, cantSubArray) {
        let result = [];
        for (let i = 0; i < arr.length; i += cantSubArray) {
            result.push(arr.slice(i, i + cantSubArray));
        }
        return result;
    }

    let arrayParts = splitArray(registration, 3);

    const pdf = new jsPDF();
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();

    let totalAprovedCourse = 0;
    let totalAprovedCredit = 0;
    let aprovedPromedi = 0;
    let totalCourse = 0;
    let totalCredit = 0;
    let generalPromedi = 0;

    let academicSemester = "-";

    const addHeader = () => {
        pdf.addImage(imgUnsm, "PNG", 10, 10, 24, 24);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "normal");
        pdf.text(universityName.toUpperCase(), pageWidth / 2, 16, "center");
        pdf.setFontSize(13);
        pdf.setFont("helvetica", "normal");
        pdf.text(facultyName.toUpperCase(), pageWidth / 2, 23, "center");
        pdf.setFontSize(15);
        pdf.setFont("helvetica", "normal");
        pdf.text(unityName.toUpperCase(), pageWidth / 2, 31, "center");
        pdf.addImage(imgFcs, "PNG", 175, 10, 24, 24);

        pdf.setFontSize(19);
        pdf.setFont("helvetica", "bold");
        pdf.text("RÉCORD ACADÉMICO", pageWidth / 2, 42, "center");
        pdf.setLineWidth(0.3);
        pdf.line(10, 44, 200, 44);

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text("PROGRAMA", 10, 51);
        pdf.text(":", 34, 51);
        pdf.setFont("helvetica", "normal");
        let splitProgram = pdf.splitTextToSize(program.toUpperCase(), 162);
        pdf.text(splitProgram, 37, 51);

        pdf.setFont("helvetica", "bold");
        pdf.text("UNIDAD", 10, 61);
        pdf.text(":", 34, 61);
        pdf.setFont("helvetica", "normal");
        pdf.text(unitRegistration.toUpperCase(), 37, 61);

        pdf.setFont("helvetica", "bold");
        pdf.text("SEDE", 118, 61);
        pdf.text(":", 129, 61);
        pdf.setFont("helvetica", "normal");
        pdf.text(sedeRegistration, 132, 61);

        pdf.setFont("helvetica", "bold");
        pdf.text("ESTUDIANTE", 10, 66);
        pdf.text(":", 34, 66);
        pdf.setFont("helvetica", "normal");
        pdf.text(person, 37, 66);

        pdf.setFont("helvetica", "bold");
        pdf.text("CÓDIGO/DNI", 10, 71);
        pdf.text(":", 34, 71);
        pdf.setFont("helvetica", "normal");
        pdf.text(personDocument, 37, 71);

        pdf.setFont("helvetica", "bold");
        pdf.text("INGRESO", 60, 71);
        pdf.text(":", 78, 71);
        pdf.setFont("helvetica", "normal");
        pdf.text(admissionPlan, 81, 71);
    };

    const addContent = (part, initialTableY) => {
        part.forEach((reg) => {
            let tempBody = [];
            reg.Registration_course.forEach((regCourse) => {
                let typeCourse =
                    regCourse.type_course === "Obligatorio" ? "O" : "E";
                totalCourse = totalCourse + 1;
                totalCredit = totalCredit + regCourse.credits;
                generalPromedi = generalPromedi + regCourse.note;
                totalAprovedCourse =
                    regCourse.note >= 14
                        ? totalAprovedCourse + 1
                        : totalAprovedCourse;
                aprovedPromedi =
                    regCourse.note >= 14
                        ? aprovedPromedi + regCourse.note
                        : aprovedPromedi;
                totalAprovedCredit =
                    regCourse.note >= 14
                        ? totalAprovedCredit + regCourse.credits
                        : totalAprovedCredit;
                let noteText = numberToLetter(parseInt(regCourse.note));
                tempBody.push([
                    regCourse.code,
                    regCourse.denomination,
                    regCourse.ciclo,
                    "NN",
                    "",
                    typeCourse,
                    regCourse.credits,
                    regCourse.note,
                    noteText,
                ]);
            });

            pdf.setFont("helvetica", "bold");
            pdf.text("SEMESTRE", 10, initialTableY - 2);
            pdf.setFont("helvetica", "bold");
            academicSemester = reg.Academic_semester.denomination;

            pdf.text(
                reg.Academic_semester.Academic_calendar.denomination +
                    " - " +
                    academicSemester,
                37,
                initialTableY - 2
            );

            pdf.autoTable({
                margin: [20, 10],
                theme: "grid",
                startY: initialTableY,
                styles: {
                    fontSize: 7,
                    font: "helvetica",
                    fontStyle: "normal",
                    cellPadding: 1.3,
                },
                headStyles: {
                    font: "helvetica",
                    fontStyle: "bold",
                    fillColor: "#000",
                },
                head: [
                    [
                        "CÓDIGO",
                        "ASIGNATURA",
                        { content: "CL", styles: { halign: "center" } },
                        { content: "CV", styles: { halign: "center" } },
                        { content: "TN", styles: { halign: "center" } },
                        { content: "TC", styles: { halign: "center" } },
                        { content: "CR", styles: { halign: "center" } },
                        "NOTA",
                        "LETRA",
                    ],
                ],
                columnStyles: {
                    0: { cellWidth: 23 },
                    // 1: { cellWidth: 111 },
                    2: { cellWidth: 7, halign: "center" },
                    3: { cellWidth: 7, halign: "center" },
                    4: { cellWidth: 7, halign: "center" },
                    5: { cellWidth: 7, halign: "center" },
                    6: { cellWidth: 7, halign: "center" },
                    7: { cellWidth: 11, halign: "center" },
                    8: { cellWidth: 20 },
                },
                body: tempBody,
            });
            initialTableY = pdf.lastAutoTable.finalY + 8;
        });
    };

    const addFooter = () => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);

        pdf.text("TOTAL CURSOS", 10, 220);
        pdf.text(":", 50, 220);
        pdf.text(String(totalCourse), 52, 220);

        pdf.text("TOTAL CRÉDITOS", 10, 225);
        pdf.text(":", 50, 225);
        pdf.text(String(totalCredit), 52, 225);

        pdf.text("PROMEDIO GENERAL", 10, 230);
        pdf.text(":", 50, 230);
        pdf.text(
            String(Math.round((generalPromedi / totalCourse) * 100) / 100),
            52,
            230
        );

        pdf.text("TOTAL DE CURSOS APROBADOS", 120, 220);
        pdf.text(":", 183, 220);
        pdf.text(String(totalAprovedCourse), 185, 220);

        pdf.text("TOTAL DE CRÉDITOS APROBADOS", 120, 225);
        pdf.text(":", 183, 225);
        pdf.text(String(totalAprovedCredit), 185, 225);

        pdf.text("PROMEDIO CR. APROBADOS", 120, 230);
        pdf.text(":", 183, 230);
        pdf.text(
            String(
                totalAprovedCourse !== 0
                    ? Math.round((aprovedPromedi / totalAprovedCourse) * 100) /
                          100
                    : 0
            ),
            185,
            230
        );
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.text("CL: Ciclo", 10, 236);
        pdf.text("CV: Curso Convalidado(C)", 30, 236);
        pdf.text("TN: Tipo de nota", 70, 236);
        pdf.text("TC: Tipo de curso(O=Obligatorio, E=Electivo)", 100, 236);
        pdf.text("CR: Créditos", 163, 236);

        pdf.setLineWidth(0.3);
        pdf.setDrawColor(0, 0, 0);
        pdf.line(73, 275, 138, 275);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text("COORDINADOR USE", pageWidth / 2, 278.5, "center");
    };

    for (let index = 0; index < pagesGenerate; index++) {
        if (index > 0) {
            pdf.addPage();
        }
        addHeader();
        addContent(arrayParts[index], 82);
        addFooter();

        pdf.setFont("helvetica", "normal");
        pdf.text(
            "Pag " + String(index + 1) + " de " + String(pagesGenerate),
            197,
            287,
            {
                align: "right",
            }
        );
    }

    pdf.save("RECORD-ACADEMICO-" + person + ".pdf");
};

// const pdfReportAutoTableRercordAcademic = async (data) => {
//     let principalOrganicUnit = data.principalOrganicUnit.description,
//         person = data.studentData.Person.name,
//         personDocument = data.studentData.Person.document_number,
//         registration = data.registration,
//         program = data.studentData.Program.denomination,
//         sedeRegistration =
//             data.studentData.Program.Organic_unit_register.Campu.denomination.toUpperCase(),
//         unitRegistration =
//             data.studentData.Program.Organic_unit_register.denomination.toUpperCase(),
//         // MPT
//         admissionPlan = data.studentData.Admission_plan.description;

//     const pdf = new jsPDF();
//     const totalPagesExp = "{total_pages_count_string}";
//     let pageWidth = pdf.internal.pageSize.getWidth();

//     pdf.addImage(imgUnsm, "PNG", 10, 10, 24, 24);
//     pdf.setFontSize(16);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(universityName.toUpperCase(), pageWidth / 2, 16, "center");
//     pdf.setFontSize(13);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(facultyName.toUpperCase(), pageWidth / 2, 23, "center");
//     pdf.setFontSize(15);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(unityName.toUpperCase(), pageWidth / 2, 31, "center");
//     pdf.addImage(imgFcs, "PNG", 175, 10, 24, 24);

//     pdf.setFontSize(19);
//     pdf.setFont("helvetica", "bold");
//     pdf.text("RÉCORD ACADÉMICO", pageWidth / 2, 42, "center");
//     pdf.setLineWidth(0.3);
//     pdf.line(10, 44, 200, 44);

//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "bold");
//     pdf.text("PROGRAMA", 10, 51);
//     pdf.text(":", 34, 51);
//     pdf.setFont("helvetica", "normal");
//     let splitProgram = pdf.splitTextToSize(program.toUpperCase(), 162);
//     pdf.text(splitProgram, 37, 51);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("UNIDAD", 10, 61);
//     pdf.text(":", 34, 61);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(unitRegistration.toUpperCase(), 37, 61);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("SEDE", 118, 61);
//     pdf.text(":", 129, 61);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(sedeRegistration, 132, 61);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("ESTUDIANTE", 10, 66);
//     pdf.text(":", 34, 66);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(person, 37, 66);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("CÓDIGO/DNI", 10, 71);
//     pdf.text(":", 34, 71);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(personDocument, 37, 71);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("INGRESO", 60, 71);
//     pdf.text(":", 78, 71);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(admissionPlan, 81, 71);

//     let totalAprovedCourse = 0;
//     let totalAprovedCredit = 0;
//     let aprovedPromedi = 0;
//     let totalCourse = 0;
//     let totalCredit = 0;
//     let generalPromedi = 0;
//     let initialTableY = 82;

//     pdf.setFontSize(7);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(moment().format("HH:mm DD/MM/YYYY "), 181, initialTableY - 2);
//     pdf.setFontSize(10);
//     let academicSemester = "-";

//     if (registration.length > 0) {
//         for (let i = 0; i < registration.length; i++) {
//             let tempBody = [];
//             for (
//                 let j = 0;
//                 j < registration[i].Registration_course.length;
//                 j++
//             ) {
//                 let typeCourse =
//                     registration[i].Registration_course[j].type_course ===
//                         "Obligatorio"
//                         ? "O"
//                         : "E";
//                 totalCourse = totalCourse + 1;
//                 totalCredit =
//                     totalCredit +
//                     registration[i].Registration_course[j].credits;
//                 generalPromedi =
//                     generalPromedi +
//                     registration[i].Registration_course[j].note;
//                 totalAprovedCourse =
//                     registration[i].Registration_course[j].note >= 14
//                         ? totalAprovedCourse + 1
//                         : totalAprovedCourse;
//                 aprovedPromedi =
//                     registration[i].Registration_course[j].note >= 14
//                         ? aprovedPromedi +
//                         registration[i].Registration_course[j].note
//                         : aprovedPromedi;
//                 totalAprovedCredit =
//                     registration[i].Registration_course[j].note >= 14
//                         ? totalAprovedCredit +
//                         registration[i].Registration_course[j].credits
//                         : totalAprovedCredit;
//                 let noteText = numberToLetter(
//                     parseInt(registration[i].Registration_course[j].note)
//                 );
//                 tempBody.push([
//                     registration[i].Registration_course[j].code,
//                     registration[i].Registration_course[j].denomination,
//                     registration[i].Registration_course[j].ciclo,
//                     "NN",
//                     "",
//                     typeCourse,
//                     registration[i].Registration_course[j].credits,
//                     registration[i].Registration_course[j].note,
//                     // " " +
//                     // noteText,
//                     noteText,
//                 ]);
//             }
//             pdf.setFont("helvetica", "bold");
//             pdf.text("SEMESTRE", 10, initialTableY - 2);
//             pdf.setFont("helvetica", "normal");
//             academicSemester = registration[i].Academic_semester.denomination;

//             pdf.text(
//                 registration[i].Academic_semester.Academic_calendar
//                     .denomination +
//                 " - " +
//                 academicSemester,
//                 37,
//                 initialTableY - 2
//             );
//             pdf.autoTable({
//                 margin: [20, 10],
//                 theme: "grid",
//                 styles: { fontSize: 7, font: "helvetica", fontStyle: "normal" },
//                 headStyles: {
//                     font: "helvetica",
//                     fontStyle: "bold",
//                     fillColor: "#000",
//                 },
//                 columnStyles: {
//                     0: { cellWidth: 23 },
//                     // 1: { cellWidth: 111 },
//                     2: { cellWidth: 7, halign: "center" },
//                     3: { cellWidth: 7, halign: "center" },
//                     4: { cellWidth: 7, halign: "center" },
//                     5: { cellWidth: 7, halign: "center" },
//                     6: { cellWidth: 7, halign: "center" },
//                     7: { cellWidth: 11, halign: "center" },
//                     8: { cellWidth: 20 },
//                 },
//                 startY: initialTableY,
//                 head: [
//                     [
//                         "CÓDIGO",
//                         "ASIGNATURA",
//                         { content: "CL", styles: { halign: "center" } },
//                         { content: "CV", styles: { halign: "center" } },
//                         { content: "TN", styles: { halign: "center" } },
//                         { content: "TC", styles: { halign: "center" } },
//                         { content: "CR", styles: { halign: "center" } },
//                         "NOTA",
//                         "LETRA",
//                     ],
//                 ],

//                 body: tempBody,
//             });
//             initialTableY = pdf.lastAutoTable.finalY + 8;
//         }
//         initialTableY = pdf.lastAutoTable.finalY;
//     }

//     pdf.setFont("helvetica", "normal");
//     pdf.text("TOTAL CURSOS", 10, initialTableY + 7);
//     pdf.text(":", 50, initialTableY + 7);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(String(totalCourse), 52, initialTableY + 7);

//     pdf.setFont("helvetica", "normal");
//     pdf.text("TOTAL CRÉDITOS", 10, initialTableY + 12);
//     pdf.text(":", 50, initialTableY + 12);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(String(totalCredit), 52, initialTableY + 12);

//     pdf.setFont("helvetica", "normal");
//     pdf.text("PROMEDIO GENERAL", 10, initialTableY + 17);
//     pdf.text(":", 50, initialTableY + 17);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(
//         String(Math.round((generalPromedi / totalCourse) * 100) / 100),
//         52,
//         initialTableY + 17
//     );

//     pdf.setFont("helvetica", "normal");
//     pdf.text("TOTAL DE CURSOS APROBADOS", 120, initialTableY + 7);
//     pdf.text(":", 183, initialTableY + 7);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(String(totalAprovedCourse), 185, initialTableY + 7);

//     pdf.setFont("helvetica", "normal");
//     pdf.text("TOTAL DE CRÉDITOS APROBADOS", 120, initialTableY + 12);
//     pdf.text(":", 183, initialTableY + 12);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(String(totalAprovedCredit), 185, initialTableY + 12);

//     pdf.setFont("helvetica", "normal");
//     pdf.text("PROMEDIO CR. APROBADOS", 120, initialTableY + 17);
//     pdf.text(":", 183, initialTableY + 17);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(
//         String(
//             totalAprovedCourse !== 0
//                 ? Math.round((aprovedPromedi / totalAprovedCourse) * 100) / 100
//                 : 0
//         ),
//         185,
//         initialTableY + 17
//     );
//     pdf.setFontSize(8);
//     pdf.setFont("helvetica", "normal");
//     pdf.text("CL: Ciclo", 10, initialTableY + 23);
//     pdf.text("CV: Curso Convalidado(C)", 30, initialTableY + 23);
//     pdf.text("TN: Tipo de nota", 70, initialTableY + 23);
//     pdf.text(
//         "TC: Tipo de curso(O=Obligatorio, E=Electivo)",
//         100,
//         initialTableY + 23
//     );
//     pdf.text("CR: Créditos", 163, initialTableY + 23);

//     pdf.setLineWidth(0.3);
//     pdf.setDrawColor(0, 0, 0);
//     pdf.line(73, 275, 138, 275);
//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(10);
//     pdf.text("FIRMA DEL COORDINADOR", pageWidth / 2, 278.5, "center");

//     const pageCount = pdf.internal.getNumberOfPages();

//     pdf.setFont("helvetica", "normal");
//     pdf.setFontSize(8);
//     for (let i = 1; i <= pageCount; i++) {
//         pdf.setPage(i);
//         pdf.text("Pag " + String(i) + " de " + String(pageCount), 197, 287, {
//             align: "right",
//         });
//     }

//     // Total page number plugin only available in jspdf v1.0+
//     if (typeof pdf.putTotalPages === "function") {
//         pdf.putTotalPages(totalPagesExp);
//     }

//     pdf.save("RECORD-ACADEMICO-" + person + ".pdf");
// };

const pdfReportAutoTableStudyPlan = async (data) => {
    console.log(data);
    let principalOrganicUnit = data.principalOrganicUnit.description,
        studyPlan = data.data.description,
        courses = data.array,
        program = data.data.Program.denomination,
        totalAprovedCredit = data.data.credit_required,
        sedeRegistration =
            data.data.Program.Organic_unit_register.Campu.denomination.toUpperCase(),
        unitRegistration =
            data.data.Program.Organic_unit_register.denomination.toUpperCase();

    // const pdf = new jsPDF({orientation: "l"});
    const pdf = new jsPDF();
    const imgData = logoUnsm;
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 6, 14, 28, 28);
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "normal");

    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTÍN", pageWidth / 2, 20, "center");

    pdf.setFontSize(18);
    pdf.text(principalOrganicUnit, pageWidth / 2, 28, "center");
    // pdf.text('N° 1', 190, 40, {align: 'right'});
    pdf.setFontSize(20);
    pdf.setFont("times", "bold");
    pdf.text(studyPlan, pageWidth / 2, 39, "center");
    pdf.setLineWidth(0.5);

    let yAxis = 50;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("PROGRAMA", 10, yAxis);
    pdf.text(":", 34, yAxis);

    pdf.setFont("helvetica", "normal");
    // pdf.text(program, 37, 40);

    let splitTitle = pdf.splitTextToSize(program, 160);
    pdf.text(splitTitle, 37, yAxis);

    //
    pdf.setFont("helvetica", "bold");
    pdf.text("UNIDAD", 10, yAxis + 10);
    pdf.text(":", 34, yAxis + 10);
    pdf.setFont("helvetica", "normal");
    pdf.text(unitRegistration, 37, yAxis + 10);

    pdf.setFont("helvetica", "bold");
    pdf.text("SEDE", 10, yAxis + 15);
    pdf.text(":", 34, yAxis + 15);
    pdf.setFont("helvetica", "normal");
    pdf.text(sedeRegistration, 37, yAxis + 15);

    let initialTableY = 75;

    let totalCourse = 0;
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.text(moment().format("HH:mm DD/MM/YYYY "), 181, initialTableY - 2);
    pdf.setFontSize(10);

    if (courses.length > 0) {
        for (let i = 0; i < courses.length; i++) {
            let tempBody = [];

            for (let j = 0; j < courses[i].Course.length; j++) {
                totalCourse = totalCourse + 1;
                let typeCourse =
                    courses[i].Course[j].type == "Obligatorio" ? "O" : "E";
                tempBody.push([
                    courses[i].Course[j].id,
                    courses[i].Course[j].order,
                    courses[i].Course[j].requirement,
                    courses[i].Course[j].denomination,
                    courses[i].Course[j].credits,
                    typeCourse,
                ]);
            }
            pdf.setFont("helvetica", "bold");
            pdf.text("CICLO", 10, initialTableY - 2);
            pdf.setFont("helvetica", "normal");

            pdf.text(courses[i].ciclo, 25, initialTableY - 2);
            pdf.autoTable({
                margin: [28, 10],
                theme: "grid",
                styles: { fontSize: 7, font: "helvetica", fontStyle: "normal" },
                headStyles: {
                    font: "helvetica",
                    fontStyle: "bold",
                    fillColor: "#000",
                },
                startY: initialTableY,
                columnStyles: {
                    0: { cellWidth: 15 },
                    1: { cellWidth: 15 },
                    2: { cellWidth: 15 },
                    3: { cellWidth: 129 },
                    4: { cellWidth: 8 },
                    5: { cellWidth: 8 },
                },
                head: [["COD", "ORDEN", "PR", "CURSO", "CR", "TC"]],
                body: tempBody,
            });
            initialTableY = pdf.lastAutoTable.finalY + 7;
        }
        initialTableY = pdf.lastAutoTable.finalY;
    }

    pdf.setFont("helvetica", "normal");
    pdf.text("TOTAL CURSOS", 10, initialTableY + 15);
    pdf.text(":", 50, initialTableY + 15);
    pdf.setFont("helvetica", "normal");
    pdf.text(String(totalCourse), 52, initialTableY + 15);

    pdf.setFont("helvetica", "normal");
    pdf.text("TOTAL CREDITOS A APROBAR", 110, initialTableY + 15);
    pdf.text(":", 173, initialTableY + 15);
    pdf.setFont("helvetica", "normal");
    pdf.text(String(totalAprovedCredit), 175, initialTableY + 15);

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text("Leyenda :", 10, initialTableY + 30);

    pdf.text(
        "TC : Tipo de curso(O=Obligatorio, E=Electivo)",
        55,
        initialTableY + 30
    );
    pdf.text("CR : Nro.Cred x Curso", 118, initialTableY + 30);
    pdf.text("PR : Pre Requisito", 150, initialTableY + 30);
    // pdf.text("FECHA :", 170, finalTable);

    const pageCount = pdf.internal.getNumberOfPages();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text("Pag " + String(i) + " de " + String(pageCount), 197, 287, {
            align: "right",
        });
    }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save(studyPlan + ".pdf");
    return true;
};

const pdfReportAutoTableActaEvaluation = async (
    facultad,
    program,
    sede,
    course,
    credit,
    teacher,
    typeCourse,
    calendar,
    process,
    totalStudent,
    approvedStudent,
    desaprovedStudent,
    columns,
    data
) => {
    let arrayColumn = [];
    columns.map((r) => {
        arrayColumn.push({ header: r.name, dataKey: r.name });
    });
    let arrayData = [];
    data.map((r, i) => {
        let json_arr = {};
        r.data.map((k, y) => {
            json_arr[arrayColumn[y].header] = k;
        });
        arrayData.push(json_arr);
    });

    const pdf = new jsPDF();
    const imgData = logoUnsm;
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTIN", 25, 15);
    pdf.addImage(imgData, "JPEG", 8, 10, 15, 13);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(mastePosgrade, 25, 20);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(
        "ACTA DE EVALUACIÓN " + calendar + " " + process,
        pageWidth / 2,
        26,
        "center"
    );
    // pdf.setFontSize(17);
    // pdf.setFont('helvetica', 'bold');
    // pdf.text(35, 25, "ACTA DE EVALUACION ACADEMICA");

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("PROGRAMA", 10, 35);
    pdf.text(":", 34, 35);

    pdf.setFont("helvetica", "normal");
    pdf.text(program, 37, 35);

    pdf.setFont("helvetica", "bold");
    pdf.text("FACULTAD", 10, 40);
    pdf.text(":", 34, 40);
    pdf.setFont("helvetica", "normal");
    pdf.text(facultad, 37, 40);

    pdf.setFont("helvetica", "bold");
    pdf.text("SEDE", 10, 45);
    pdf.text(":", 34, 45);
    pdf.setFont("helvetica", "normal");
    pdf.text(sede, 37, 45);

    pdf.setFont("helvetica", "bold");
    pdf.text("ASIGNATURA", 10, 50);
    pdf.text(":", 34, 50);
    pdf.setFont("helvetica", "normal");
    pdf.text(course, 37, 50);

    pdf.setFont("helvetica", "bold");
    pdf.text("CREDITOS", 10, 55);
    pdf.text(":", 34, 55);
    pdf.setFont("helvetica", "normal");
    pdf.text(credit, 37, 55);

    pdf.setFont("helvetica", "bold");
    pdf.text("TIPO CURSO :", 59, 55);
    pdf.setFont("helvetica", "normal");
    pdf.text(typeCourse, 84, 55);

    pdf.setFont("helvetica", "bold");
    pdf.text("DOCENTE RESPONSABLE :", 10, 65);
    pdf.setFont("helvetica", "normal");
    pdf.text(teacher, 59, 65);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setLineDash([2.5]);
    pdf.line(145, 63, 195, 63);
    pdf.text("FIRMA DOCENTE", 159, 66);
    pdf.setLineDash([0]);

    pdf.autoTable({
        margin: [28, 10],
        theme: "grid",
        styles: {
            fontSize: 9,
            font: "helvetica",
            fontStyle: "normal",
        },
        headStyles: {
            font: "helvetica",
            fontStyle: "bold",
            fillColor: "#000",
        },
        startY: 70,
        columns: arrayColumn,
        body: arrayData,
        didDrawPage: function (data) {
            // Header
            // doc.setFontSize(20)
            // doc.setTextColor(40)
            // if (base64Img) {
            //     doc.addImage(base64Img, 'JPEG', data.settings.margin.left, 15, 10, 10)
            // }
            // doc.text('Report', data.settings.margin.left + 15, 22)
            // Footer
            // let str = 'Pag ' + pdf.internal.getNumberOfPages()
            // // Total page number plugin only available in jspdf v1.0+
            // if (typeof pdf.putTotalPages === 'function') {
            //     str = str + ' de ' + totalPagesExp
            // }
            // pdf.setFontSize(8)
            //
            // // jsPDF 1.4+ uses getWidth, <1.4 uses .width
            // const pageSize = pdf.internal.pageSize
            // const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
            // pdf.text(str, data.settings.margin.left, pageHeight - 8)
        },
    });

    let finalTable = pdf.lastAutoTable.finalY + 10;
    pdf.setFontSize(10);
    // pdf.setFont("helvetica", "bold");
    // pdf.text("1 . ORIGINAL :", 10, finalTable);
    // pdf.setFont("helvetica", "normal");
    // pdf.text("OCRA", 35, finalTable);
    pdf.setFont("helvetica", "bold");
    pdf.text("1 . ORIGINAL :", 10, finalTable + 5);
    pdf.setFont("helvetica", "normal");
    pdf.text("ESCUELA DE SEUNSM", 35, finalTable + 5);
    pdf.setFont("helvetica", "bold");
    pdf.text("2 . COPIA", 10, finalTable + 10);
    pdf.text(":", 33, finalTable + 10);
    pdf.setFont("helvetica", "normal");
    pdf.text("URT/PC", 35, finalTable + 10);
    pdf.setFont("helvetica", "bold");
    pdf.text("3 . COPIA", 10, finalTable + 15);
    pdf.text(":", 33, finalTable + 15);
    pdf.setFont("helvetica", "normal");
    pdf.text("PROFESOR DEL CURSO", 35, finalTable + 15);
    pdf.setFont("helvetica", "bold");
    pdf.text("FECHA :", 140, finalTable + 15);
    pdf.setFont("helvetica", "normal");
    pdf.text(moment().format("DD/MM/YYYY "), 155, finalTable + 15);

    pdf.autoTable({
        margin: [10, 10],
        startY: finalTable + 20,
        theme: "grid",
        styles: {
            fontSize: 9,
            font: "helvetica",
            fontStyle: "normal",
            maxCellHeight: 4,
        },
        headStyles: {
            font: "helvetica",
            fontStyle: "bold",
            fillColor: "#000",
        },
        tableWidth: 61,
        head: [["RESUMEN", "N°", "%"]],
        body: [
            ["Alumnos Matrículados", totalStudent, "100"],
            [
                "Alumnos Aprobados",
                approvedStudent,
                Math.round((approvedStudent * 100) / totalStudent),
            ],
            [
                "Alumnos Desaprobados",
                desaprovedStudent,
                Math.round((desaprovedStudent * 100) / totalStudent),
            ],
        ],
    });
    let finalTable2 = pdf.lastAutoTable.finalY;
    pdf.setFont("helvetica", "bold");
    pdf.setDrawColor(0, 0, 0);
    pdf.setFontSize(8);
    pdf.setLineDash([2.5]);
    pdf.line(10, finalTable2 + 25, 70, finalTable2 + 25);
    pdf.text("V°,B' Tecnico", 30, finalTable2 + 28);

    pdf.line(160, finalTable2 + 25, 200, finalTable2 + 25);
    pdf.text("Fecha de Recepción", 130, finalTable2 + 25);
    pdf.setLineDash([0]);

    const pageCount = pdf.internal.getNumberOfPages();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text("Pag " + String(i) + " de " + String(pageCount), 197, 287, {
            align: "right",
        });
    }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }
    pdf.save(program + ".pdf");
};

// const pdfReportAutoTableActa = async (record) => {
//     let principalOrganicUnit = record.principalOrganicUnit.description,
//         facultad = record.faculty,
//         program = record.program,
//         sede = record.campus,
//         course = record.Course.denomination,
//         credit = record.Course.credits,
//         typeCourse = record.Course.type,
//         teacher = record.teacher,
//         semester = record.semester,
//         actaDate = record.acta_date,
//         correlative = record.correlative,
//         totalStudent = record.totalStudent,
//         approvedStudent = record.approvedStudent,
//         desaprovedStudent = record.desaprovedStudent,
//         data = record.students,
//         // MPT
//         ciclo = record.ciclo;

//     const pdf = new jsPDF();
//     const totalPagesExp = "{total_pages_count_string}";
//     let pageWidth = pdf.internal.pageSize.getWidth();

//     pdf.addImage(imgUnsm, "PNG", 13, 14, 28, 28);
//     pdf.setFontSize(17);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(universityName.toUpperCase(), pageWidth / 2, 20, "center");
//     pdf.setFontSize(14);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(facultyName.toUpperCase(), pageWidth / 2, 28, "center");
//     pdf.setFontSize(16);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(unityName.toUpperCase(), pageWidth / 2, 36, "center");
//     pdf.addImage(imgFcs, "PNG", 169, 14, 28, 28);

//     pdf.setFontSize(22);
//     pdf.setFont("helvetica", "bold");
//     pdf.text("ACTA DE EVALUACIÓN " + semester, pageWidth / 2, 46, "center");
//     pdf.setLineWidth(0.3);
//     pdf.line(20, 47, 190, 47);

//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "bold");
//     pdf.text("CÓDIGO", 20, 52);
//     pdf.text(":", 44, 52);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(correlative, 47, 52);

//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "bold");
//     pdf.text("PROGRAMA", 20, 57);
//     pdf.text(":", 44, 57);
//     pdf.setFont("helvetica", "normal");
//     let splitTitle = pdf.splitTextToSize(program, 142);
//     pdf.text(splitTitle, 47, 57);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("FACULTAD", 20, 67);
//     pdf.text(":", 44, 67);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(facultad.toUpperCase(), 47, 67);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("SEDE", 20, 72);
//     pdf.text(":", 44, 72);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(sede, 47, 72);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("ASIGNATURA", 20, 77);
//     pdf.text(":", 44, 77);
//     pdf.setFont("helvetica", "normal");
//     let splitCourse = pdf.splitTextToSize(course, 142);
//     pdf.text(splitCourse, 47, 77);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("CICLO", 20, 82);
//     pdf.text(":", 44, 82);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(ciclo, 47, 82);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("CRÉDITOS :", 60, 82);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(String(credit), 82, 82);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("TIPO CURSO :", 97, 82);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(typeCourse, 123, 82);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("DOCENTE RESPONSABLE :", 20, 87);
//     pdf.setFont("helvetica", "normal");
//     let splitTeacher = pdf.splitTextToSize(teacher, 80);
//     pdf.text(splitTeacher, 69, 87);

//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(8);
//     pdf.setLineDash([2]);
//     pdf.line(153, 87, 189, 87);
//     pdf.text("FIRMA DOCENTE", 159, 90);
//     pdf.setLineDash([0]);

//     pdf.autoTable({
//         margin: [28, 20],
//         theme: "grid",
//         styles: {
//             fontSize: 9,
//             font: "helvetica",
//             fontStyle: "normal",
//         },
//         headStyles: {
//             font: "helvetica",
//             fontStyle: "bold",
//             fillColor: "#000",
//         },
//         startY: 95,
//         head: [
//             ["#", "APELLIDOS Y NOMBRES", "CÓDIGO", "NOTA LETRA", "NOTA NÚMERO"],
//         ],
//         body: data,
//     });

//     let finalTable = pdf.lastAutoTable.finalY;

//     let freeY1 = (297 - finalTable).toString();
//     if (freeY1 < 40) {
//         pdf.addPage();
//         finalTable = 9;
//     }

//     pdf.setFontSize(9);
//     pdf.setFont("helvetica", "bold");
//     pdf.text("1 . ORIGINAL :", 20, finalTable + 10);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(principalOrganicUnit.toUpperCase(), 45, finalTable + 10);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("2 . COPIA", 20, finalTable + 15);
//     pdf.text(":", 43, finalTable + 15);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(principalOrganicUnit.toUpperCase(), 45, finalTable + 15);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("3 . COPIA", 20, finalTable + 20);
//     pdf.text(":", 43, finalTable + 20);
//     pdf.setFont("helvetica", "normal");
//     pdf.text("OAA", 45, finalTable + 20);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("4 . COPIA", 20, finalTable + 25);
//     pdf.text(":", 43, finalTable + 25);
//     pdf.setFont("helvetica", "normal");
//     pdf.text("DOCENTE DEL CURSO", 45, finalTable + 25);

//     pdf.setFont("helvetica", "bold");
//     pdf.text("FECHA :", 157, finalTable + 25);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(moment(actaDate).format("DD/MM/YYYY "), 172, finalTable + 25);

//     pdf.autoTable({
//         margin: [10, 20],
//         startY: finalTable + 30,
//         theme: "grid",
//         styles: {
//             fontSize: 9,
//             font: "helvetica",
//             fontStyle: "normal",
//             maxCellHeight: 4,
//         },
//         headStyles: {
//             font: "helvetica",
//             fontStyle: "bold",
//             fillColor: "#000",
//         },
//         tableWidth: 61,
//         head: [["RESUMEN", "N°", "%"]],
//         body: [
//             ["Alumnos Matriculados", totalStudent, "100"],
//             [
//                 "Alumnos Aprobados",
//                 approvedStudent,
//                 Math.round((approvedStudent * 100) / totalStudent),
//             ],
//             [
//                 "Alumnos Desaprobados",
//                 desaprovedStudent,
//                 Math.round((desaprovedStudent * 100) / totalStudent),
//             ],
//         ],
//     });

//     let finalTable2 = pdf.lastAutoTable.finalY + 5;

//     let freeY2 = (297 - finalTable2).toString();
//     if (freeY2 < 40) {
//         pdf.addPage();
//         finalTable2 = 9;
//     }

//     pdf.setFont("helvetica", "bold");
//     pdf.setDrawColor(0, 0, 0);
//     pdf.setFontSize(8);
//     pdf.setLineDash([2]);

//     pdf.line(20, finalTable2 + 25, 65, finalTable2 + 25);
//     pdf.text("V°,B' Técnico", 30, finalTable2 + 28);

//     pdf.text("Fecha de Recepción:", 130, finalTable2 + 25);
//     pdf.line(160, finalTable2 + 25, 190, finalTable2 + 25);
//     pdf.setLineDash([0]);

//     const pageCount = pdf.internal.getNumberOfPages();

//     pdf.setFont("helvetica", "normal");
//     pdf.setFontSize(8);
//     for (let i = 1; i <= pageCount; i++) {
//         pdf.setPage(i);
//         pdf.text("Pag " + String(i) + " de " + String(pageCount), 197, 287, {
//             align: "right",
//         });
//     }

//     // Total page number plugin only available in jspdf v1.0+
//     if (typeof pdf.putTotalPages === "function") {
//         pdf.putTotalPages(totalPagesExp);
//     }
//     pdf.save("ACTA DE EVALUACIÓN " + correlative + ".pdf");
// };

const pdfReportAutoTableActa = async (record) => {
    let principalOrganicUnit = record.principalOrganicUnit.description,
        facultad = record.faculty,
        program = record.program,
        sede = record.campus,
        courseCode = record.Course.code,
        course = record.Course.denomination,
        credit = record.Course.credits,
        typeCourse = record.Course.type,
        teacher = record.teacher,
        semester = record.semester,
        actaDate = record.acta_date,
        correlative = record.correlative,
        totalStudent = record.totalStudent,
        approvedStudent = record.approvedStudent,
        desaprovedStudent = record.desaprovedStudent,
        data = record.students,
        ciclo = record.ciclo;

    let pagesGenerate = Math.ceil(data.length / 15);

    function splitArray(arr, cantSubArray) {
        let result = [];
        for (let i = 0; i < arr.length; i += cantSubArray) {
            result.push(arr.slice(i, i + cantSubArray));
        }
        return result;
    }

    let arrayParts = splitArray(data, 15);

    const pdf = new jsPDF();
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();

    const addHeader = () => {
        pdf.addImage(imgUnsm, "PNG", 10, 20, 24, 24);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "normal");
        pdf.text(universityName.toUpperCase(), pageWidth / 2, 26, "center");
        pdf.setFontSize(13);
        pdf.setFont("helvetica", "normal");
        pdf.text(facultyName.toUpperCase(), pageWidth / 2, 33, "center");
        pdf.setFontSize(15);
        pdf.setFont("helvetica", "normal");
        pdf.text(unityName.toUpperCase(), pageWidth / 2, 41, "center");
        pdf.addImage(imgFcs, "PNG", 175, 20, 24, 24);

        pdf.setFontSize(19);
        pdf.setFont("helvetica", "bold");
        pdf.text(
            "ACTA DE EVALUACIÓN ACADÉMICA REGULAR " + semester,
            pageWidth / 2,
            52,
            "center"
        );
        pdf.setLineWidth(0.3);
        pdf.setDrawColor(0, 0, 0);
        pdf.line(10, 53, 200, 53);

        pdf.setFontSize(9.5);
        pdf.setFont("helvetica", "bold");
        pdf.text("CÓDIGO", 10, 59);
        pdf.text(":", 36, 59);
        pdf.setFont("helvetica", "normal");
        pdf.text(correlative, 39, 59);

        pdf.setFont("helvetica", "bold");
        pdf.text("PROGRAMA", 10, 64);
        pdf.text(":", 36, 64);
        pdf.setFont("helvetica", "normal");
        let splitTitle = pdf.splitTextToSize(program, 162);
        pdf.text(splitTitle, 39, 64);

        pdf.setFont("helvetica", "bold");
        pdf.text("FACULTAD", 10, 73);
        pdf.text(":", 36, 73);
        pdf.setFont("helvetica", "normal");
        pdf.text(facultad.toUpperCase(), 39, 73);

        pdf.setFont("helvetica", "bold");
        pdf.text("SEDE", 114, 73);
        pdf.text(":", 126, 73);
        pdf.setFont("helvetica", "normal");
        pdf.text(sede, 129, 73);

        pdf.setFont("helvetica", "bold");
        pdf.text("ASIGNATURA", 10, 78);
        pdf.text(":", 36, 78);
        pdf.setFont("helvetica", "normal");
        let splitCourse = pdf.splitTextToSize(
            "(" + courseCode + ") " + course,
            162
        );
        pdf.text(splitCourse, 39, 78);

        let ySpace = 5;
        if (splitCourse.length > 1) {
            ySpace = 9;
        }

        pdf.setFont("helvetica", "bold");
        pdf.text("CICLO", 10, 78 + ySpace);
        pdf.text(":", 36, 78 + ySpace);
        pdf.setFont("helvetica", "normal");
        pdf.text(ciclo, 39, 78 + ySpace);

        pdf.setFont("helvetica", "bold");
        pdf.text("CRÉDITOS :", 53, 78 + ySpace);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(credit), 74, 78 + ySpace);

        pdf.setFont("helvetica", "bold");
        pdf.text("TIPO :", 88, 78 + ySpace);
        pdf.setFont("helvetica", "normal");
        pdf.text(typeCourse, 100, 78 + ySpace);

        pdf.setFont("helvetica", "bold");
        pdf.text("SEMESTRE ACADÉMICO :", 135, 78 + ySpace);
        pdf.setFont("helvetica", "normal");
        pdf.text(semester, 179, 78 + ySpace);

        pdf.setFont("helvetica", "bold");
        pdf.text("DOCENTE", 10, 83 + ySpace);
        pdf.text(":", 36, 83 + ySpace);
        pdf.setFont("helvetica", "normal");
        pdf.text(teacher, 39, 83 + ySpace);
    };

    const addContent = (part) => {
        pdf.autoTable({
            margin: [10, 10],
            theme: "grid",
            startY: 95,
            headStyles: {
                font: "helvetica",
                fontStyle: "bold",
                fillColor: "#000",
            },
            head: [
                [
                    "#",
                    "APELLIDOS Y NOMBRES",
                    { content: "CÓDIGO", styles: { halign: "center" } },
                    "NOTA",
                    "LETRA",
                ],
            ],
            styles: {
                fontSize: 9,
                font: "helvetica",
                fontStyle: "normal",
                cellPadding: 1.3,
            },
            columnStyles: {
                0: { cellWidth: 8 },
                2: { cellWidth: 20, halign: "center" },
                3: { cellWidth: 13, halign: "center" },
                4: { cellWidth: 24 },
            },
            body: part,
        });
    };

    const addFooter = (finalTable) => {
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "bold");
        pdf.text("FECHA DE EMISIÓN :", 10, finalTable + 6);
        pdf.setFont("helvetica", "normal");
        pdf.text(moment(actaDate).format("DD/MM/YYYY"), 40, finalTable + 6);

        pdf.setFont("helvetica", "bold");
        pdf.text("HORA DE EMISIÓN :", 63, finalTable + 6);
        pdf.setFont("helvetica", "normal");
        pdf.text(
            moment(actaDate).format("HH:mm:ss") + " Hrs",
            91,
            finalTable + 6
        );

        pdf.setFont("helvetica", "bold");
        pdf.text("FECHA DE RECEPCIÓN :", 133, 260);
        pdf.setLineWidth(0.3);
        pdf.setDrawColor(0, 0, 0);
        pdf.line(170, 260, 200, 260);

        pdf.setFont("helvetica", "bold");
        pdf.setDrawColor(0, 0, 0);
        pdf.setFontSize(8);
        pdf.setLineWidth(0.3);
        pdf.setDrawColor(0, 0, 0);
        pdf.line(20, 237, 70, 237);
        pdf.text("DOCENTE", 37, 240);
        pdf.line(140, 237, 190, 237);
        pdf.text("V° B° COORDINADOR USE", 147, 240);

        pdf.autoTable({
            margin: [10, 10],
            theme: "grid",
            startY: 245,
            tableWidth: 120,
            headStyles: {
                font: "helvetica",
                fontStyle: "bold",
                fillColor: "#000",
                halign: "center",
            },
            head: [
                ["DESCRIPCIÓN", "MATRICULADOS", "APROBADOS", "DESAPROBADOS"],
            ],
            styles: {
                fontSize: 9,
                font: "helvetica",
                fontStyle: "normal",
                halign: "center",
                cellPadding: { top: 1, bottom: 1 },
            },
            body: [
                ["CANTIDAD", totalStudent, approvedStudent, desaprovedStudent],
                [
                    "PORCENTAJE",
                    "100.00%",
                    Math.round((approvedStudent * 100) / totalStudent).toFixed(
                        2
                    ) + "%",
                    Math.round(
                        (desaprovedStudent * 100) / totalStudent
                    ).toFixed(2) + "%",
                ],
            ],
        });

        let finalTable3 = pdf.lastAutoTable.finalY;

        pdf.setFontSize(7);
        pdf.setFont("helvetica", "bold");
        pdf.text("1. ORIGINAL", 10, finalTable3 + 5);
        pdf.text(":", 33, finalTable3 + 5);
        pdf.setFont("helvetica", "normal");
        pdf.text(principalOrganicUnit.toUpperCase(), 35, finalTable3 + 5);

        pdf.setFont("helvetica", "bold");
        pdf.text("2. COPIA", 10, finalTable3 + 8);
        pdf.text(":", 33, finalTable3 + 8);
        pdf.setFont("helvetica", "normal");
        pdf.text(principalOrganicUnit.toUpperCase(), 35, finalTable3 + 8);

        pdf.setFont("helvetica", "bold");
        pdf.text("3. COPIA", 10, finalTable3 + 11);
        pdf.text(":", 33, finalTable3 + 11);
        pdf.setFont("helvetica", "normal");
        pdf.text("DIRECCIÓN DE ASUNTOS ACADÉMICOS", 35, finalTable3 + 11);

        pdf.setFont("helvetica", "bold");
        pdf.text("4. COPIA", 10, finalTable3 + 14);
        pdf.text(":", 33, finalTable3 + 14);
        pdf.setFont("helvetica", "normal");
        pdf.text("DOCENTE", 35, finalTable3 + 14);
    };

    for (let index = 0; index < pagesGenerate; index++) {
        if (index > 0) {
            pdf.addPage();
        }
        addHeader();
        addContent(arrayParts[index]);
        let finalTable = pdf.lastAutoTable.finalY;
        addFooter(finalTable);

        pdf.setFont("helvetica", "normal");
        pdf.text(
            "Pág " + String(index + 1) + " de " + String(pagesGenerate),
            197,
            287,
            {
                align: "right",
            }
        );
    }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }
    pdf.save("ACTA DE EVALUACIÓN " + correlative + ".pdf");
};

const pdfReportAutoTableRegistrationModule = async (
    organicUnit,
    process,
    columns,
    data
) => {
    let arrayColumn = [];
    columns.map((r, i) => {
        arrayColumn.push({ header: r.name, dataKey: r.name });
    });
    let arrayData = [];
    data.map((r) => {
        let json_arr = {};
        r.data.map((k, y) => {
            json_arr[arrayColumn[y].header] = k;
        });
        arrayData.push(json_arr);
    });

    // console.log(arrayData)
    // // const pdf = new jsPDF({orientation: "l"});
    const pdf = new jsPDF();
    const imgData = logoUnsm;
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTIN", 25, 15);
    pdf.addImage(imgData, "JPEG", 8, 10, 15, 13);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(mastePosgrade, 25, 20);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(
        "REPORTE DE ESTUDIANTES MATRÍCULADOS",
        pageWidth / 2,
        30,
        "center"
    );

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("UNIDAD", 10, 40);
    pdf.text(":", 34, 40);

    pdf.setFont("helvetica", "normal");
    pdf.text(organicUnit, 37, 40);
    //
    // //
    pdf.setFont("helvetica", "bold");
    pdf.text("PROCESO", 10, 45);
    pdf.text(":", 34, 45);
    pdf.setFont("helvetica", "normal");
    pdf.text(process, 37, 45);
    //
    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL", 10, 50);
    pdf.text(":", 34, 50);
    pdf.setFont("helvetica", "normal");
    pdf.text(String(arrayData.length), 37, 50);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.text(moment().format("HH:mm DD/MM/YYYY "), 181, 50);
    // pdf.setFont('helvetica', "bold");
    // pdf.text("ESTUDIANTE", 10, 55);
    // pdf.text(":", 34, 55);
    // pdf.setFont("helvetica", "normal");
    // pdf.text(student, 37, 55);

    pdf.autoTable({
        margin: [28, 10],
        theme: "grid",
        styles: {
            fontSize: 7,
            font: "helvetica",
            fontStyle: "normal",
        },
        headStyles: {
            font: "helvetica",
            fontStyle: "bold",
            fillColor: "#000",
        },
        startY: 55,
        columns: arrayColumn,
        body: arrayData,
    });
    let finalTable = pdf.lastAutoTable.finalY + 10;

    const pageCount = pdf.internal.getNumberOfPages();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text("Pag " + String(i) + " de " + String(pageCount), 197, 287, {
            align: "right",
        });
    }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("REPORTE DE ESTUDIANTES MATRÍCULADOS" + ".pdf");
};

const pdfReportAutoTableRegistrationByAdmissionPlan = async (
    title,
    organicUnit,
    program,
    admissionPlan,
    columns,
    data
) => {
    let arrayColumn = [];
    let _data = [];

    data.map((r, index) => {
        _data.push([index + 1, r.Person.name, r.Person.document_number]);
        let temp = [];
        let algo = "";
        if (r.Registration.length > 0) {
            r.Registration.map((m, i) => {
                algo =
                    m.Academic_semester.Academic_calendar.denomination.substr(
                        -4
                    ) +
                    " - " +
                    m.Academic_semester.denomination.substr(-1) +
                    " " +
                    m.type +
                    " | ";
                temp.push(algo);
            });
        } else {
            algo = "No def.";
            temp.push(algo);
        }
        _data[index].push(temp);
    });
    const pdf = new jsPDF({ orientation: "l" });
    // const pdf = new jsPDF({orientation: "l"});
    const imgData = logoUnsm;
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    // let pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTIN", 25, 15);
    pdf.addImage(imgData, "JPEG", 8, 10, 15, 13);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(mastePosgrade, 25, 20);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, pageWidth / 2, 30, "center");

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("PROGRAMA", 10, 40);
    pdf.text(":", 34, 40);

    pdf.setFont("helvetica", "normal");
    pdf.text(program, 37, 40);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("UNIDAD", 10, 50);
    pdf.text(":", 34, 50);

    pdf.setFont("helvetica", "normal");
    pdf.text(organicUnit, 37, 50);

    pdf.setFont("helvetica", "bold");
    pdf.text("ADMISIÓN", 10, 55);
    pdf.text(":", 34, 55);
    pdf.setFont("helvetica", "normal");
    pdf.text(admissionPlan, 37, 55);

    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL", 10, 60);
    pdf.text(":", 34, 60);
    pdf.setFont("helvetica", "normal");
    pdf.text("12", 37, 60);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.text(moment().format("HH:mm DD/MM/YYYY "), 181, 60);

    pdf.autoTable({
        margin: [28, 10],
        theme: "grid",
        styles: {
            fontSize: 7,
            font: "helvetica",
            fontStyle: "normal",
        },
        headStyles: {
            font: "helvetica",
            fontStyle: "bold",
            fillColor: "#000",
        },
        startY: 65,
        columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 85 },
            2: { cellWidth: 19 },
            3: { cellWidth: 165 },
        },

        head: [["#", "NOMBRE", "DNI", "MATRÍCULA"]],
        body: _data,
    });
    let finalTable = pdf.lastAutoTable.finalY + 10;

    const pageCount = pdf.internal.getNumberOfPages();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text("Pag " + String(i) + " de " + String(pageCount), 197, 287, {
            align: "right",
        });
    }

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save(
        "R.E.M." + program + "-" + organicUnit + "-" + admissionPlan + ".pdf"
    );
};

const pdfReportAutoTablePaymentPendient = async (title1, columns, data) => {
    let arrayColumn = [];
    let TOTAL = 0;
    columns.map((r) => {
        arrayColumn.push({ header: r.name, dataKey: r.name });
    });
    let arrayData = [];
    data.map((r) => {
        let json_arr = {};
        r.data.map((k, y) => {
            json_arr[arrayColumn[y].header] = k;
        });
        TOTAL = parseFloat(r.data[4]) + TOTAL;
        arrayData.push(json_arr);
    });

    const pdf = new jsPDF();
    const imgData = logoUnsm;
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("UNIVERSIDAD NACIONAL DE SAN MARTIN", 25, 15);
    pdf.addImage(imgData, "JPEG", 8, 10, 15, 13);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(mastePosgrade, 25, 20);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(title1, pageWidth / 2, 30, "center");

    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL", 10, 35);
    pdf.text(":", 34, 35);
    pdf.setFont("helvetica", "normal");
    pdf.text(String(TOTAL), 37, 35);

    pdf.autoTable({
        margin: [28, 10],
        theme: "grid",
        styles: {
            fontSize: 7,
            font: "helvetica",
            fontStyle: "normal",
        },
        headStyles: {
            font: "helvetica",
            fontStyle: "bold",
            fillColor: "#000",
        },
        startY: 40,
        columns: arrayColumn,
        body: arrayData,
    });
    const pageCount = pdf.internal.getNumberOfPages();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text("Pag " + String(i) + " de " + String(pageCount), 197, 287, {
            align: "right",
        });
    }

    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("REPORTE PAGOS PENDIENTES" + ".pdf");
};

const xlxsReportSuneduEntry = (a) => {
    // let cols = [{name: "A", key: 0}, {name: "B", key: 1}, {name: "C", key: 2}];
    let data = [
        ["id", "name", "value"],
        [1, "sheetjs", 7262],
        [2, "js-xlsx", 6969],
    ];
    /* convert from workbook to array of arrays */
    // const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // const dd = XLSX.utils.sheet_to_json(first_worksheet, {header:1});

    /* convert from array of arrays to workbook */
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, worksheet, "SheetJS");
};

const info = localStorage.getItem("INFO")
    ? JSON.parse(crypt.decrypt(localStorage.getItem("INFO"), k, v))
    : "";
const ORGANIC_UNIT = info.role ? info.role.id_organic_unit : "";
const USER_TYPE = info.mode ? "" : info.role.Role.denomination;

const numberToLetter = (num) => {
    let number;
    switch (num) {
        case 0:
            number = "CERO";
            break;
        case 1:
            number = "UNO";
            break;
        case 2:
            number = "DOS";
            break;
        case 3:
            number = "TRES";
            break;
        case 4:
            number = "CUATRO";
            break;
        case 5:
            number = "CINCO";
            break;
        case 6:
            number = "SEIS";
            break;
        case 7:
            number = "SIETE";
            break;
        case 8:
            number = "OCHO";
            break;
        case 9:
            number = "NUEVE";
            break;
        case 10:
            number = "DIEZ";
            break;
        case 11:
            number = "ONCE";
            break;
        case 12:
            number = "DOCE";
            break;
        case 13:
            number = "TRECE";
            break;
        case 14:
            number = "CATORCE";
            break;
        case 15:
            number = "QUINCE";
            break;
        case 16:
            number = "DIECISÉIS";
            break;
        case 17:
            number = "DIECISIETE";
            break;
        case 18:
            number = "DIECIOCHO";
            break;
        case 19:
            number = "DIECINUEVE";
            break;
        case 20:
            number = "VEINTE";
            break;
    }
    return number;
};

const Notify = (type, message) => {
    switch (type) {
        case "success":
            return PNotify.success({
                title: "Finalizado",
                text: message,
                delay: 2000,
                stack: {
                    dir1: "up",
                    dir2: "left",
                    firstpos1: 25,
                    firstpos2: 25,
                },
            });

            break;

        case "error":
            return PNotify.error({
                title: "Oh no!",
                text: message,
                delay: 2000,
                stack: {
                    dir1: "up",
                    dir2: "left",
                    firstpos1: 25,
                    firstpos2: 25,
                },
            });

            break;
        case "notice":
            return PNotify.notice({
                title: "Oh no!",
                text: message,
                delay: 2000,
                stack: {
                    dir1: "up",
                    dir2: "left",
                    firstpos1: 25,
                    firstpos2: 25,
                },
            });

            break;

        default:
            break;
    }
};

// NUEVAS FUNCIONES MPT
const pdfReportAutoTableConstancyExpeditoSustentationSeunsm = async (data) => {
    let student = data.studentData.Person.name;
    let firtsRegister = data.firtsRegister;
    let lastRegister = data.lastRegister;
    let codeStudent = data.studentData.Person.document_number;
    let program = data.studentData.Program.denomination;
    let admissionPlan = data.studentData.Admission_plan.description.substr(-7);
    let credit = data.studentData.Admission_plan.Plan.credit_required;
    let correlative = data.correlative;
    let date = data.date;
    let principalOrganicUnit = data.principalOrganicUnit.description;

    // GENDER
    let articleGender =
        data.studentData.Person.gender === "Femenino" ? "La" : "El";
    let interestedGender =
        data.studentData.Person.gender === "Femenino"
            ? "de la interesada"
            : "del interesado";

    const pdf = new jsPDF();
    const totalPagesExp = "{total_pages_count_string}";
    let pageWidth = pdf.internal.pageSize.getWidth();
    pdf.addImage(imgUnsm, "PNG", 10, 10, 24, 24);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    pdf.text(universityName.toUpperCase(), pageWidth / 2, 16, "center");
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "normal");
    pdf.text(facultyName.toUpperCase(), pageWidth / 2, 23, "center");
    pdf.setFontSize(15);
    pdf.setFont("helvetica", "normal");
    pdf.text(unityName.toUpperCase(), pageWidth / 2, 31, "center");
    pdf.addImage(imgFcs, "PNG", 175, 10, 24, 24);

    pdf.setFontSize(19);
    pdf.setFont("helvetica", "bold");
    pdf.text(
        "CONSTANCIA DE EXPEDITO PARA SUSTENTACIÓN N° " + correlative,
        pageWidth / 2,
        50,
        "center"
    );
    pdf.setLineWidth(0.3);
    pdf.line(10, 52, 200, 52);

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        "La Coordinadora de la " +
            unityName +
            " - " +
            facultyName +
            " - " +
            universityName +
            ", extiende la presente constancia a:",
        10,
        65,
        {
            maxWidth: 189,
            align: "justify",
        }
    );

    pdf.setFontSize(19);
    pdf.setFont("helvetica", "bold");
    pdf.text("Obsta. " + student, pageWidth / 2, 90, "center");

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
        articleGender +
            " estudiante con código (DNI) N° " +
            codeStudent +
            ", ha culminado sus estudios en el Programa de " +
            program +
            " - Promoción Ingreso " +
            admissionPlan +
            ", con un total de " +
            credit +
            " créditos de acuerdo a las Normas y Reglamentos de la " +
            unityName +
            " - " +
            facultyName +
            " - " +
            universityName +
            ".",
        10,
        103,
        {
            maxWidth: 189,
            align: "justify",
        }
    );
    pdf.text(
        "Fecha inicio: " + firtsRegister + "; Fecha fin: " + lastRegister,
        10,
        140,
        {
            maxWidth: 189,
            align: "justify",
        }
    );
    pdf.text(
        "Se extiende la presente constancia a petición " +
            interestedGender +
            " para los fines que considere conveniente.",
        10,
        152,
        {
            maxWidth: 189,
            align: "justify",
        }
    );

    pdf.setFont("helvetica", "bold");
    pdf.text("Tarapoto, " + date, 118, 185);

    pdf.text("Atentamente", pageWidth / 2, 210, "center");

    pdf.line(58, 249, 153, 249);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Obsta. Dra. Rosa Rios Lopez", pageWidth / 2, 253.5, "center");
    pdf.setFont("helvetica", "normal");

    pdf.text("COORDINADORA", pageWidth / 2, 258.5, "center");

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(unityName + " - FCS - UNSM", pageWidth / 2, 263.5, "center");

    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === "function") {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save("CONSTANCIA-EGRESO-" + student + ".pdf");
};

const Componet = {
    ORGANIC_UNIT,
    USER_TYPE,
    spin,
    spiner,
    MuiOption,
    selectSearchStyle,
    Notify,
    generateCode,
    encryptUrlID,
    numberToLetter,
    pdfReportAutoTable,
    pdfReportAutoTableThreeTitle,
    pdfReportAutoVoucherStudent,
    pdfReportAutoConceptStudent,
    pdfReportAutoPaymentProgramAdmision,
    pdfReportAutoRecordAcademico,
    pdfReportAutoTableActaEvaluation,
    pdfReportAutoTableActa,
    pdfReportAutoTableStudyPlan,
    pdfReportAutoTableFichaRegistration,
    pdfReportAutoTableConstancyEntry,
    pdfReportAutoTableConstancyExpedito,
    pdfReportAutoTableConstancyStudy,
    pdfReportAutoTableConstancyEgress,
    pdfReportAutoTableConstancyAdeudar,
    pdfReportAutoTableConstancyRegistration,
    pdfReportAutoTableConstancyOrdenMerito,
    pdfReportAutoTableCertStudy2,
    pdfReportAutoTableRercordAcademic,
    pdfReportAutoTableRegistrationModule,
    pdfReportAutoTableRegistrationByAdmissionPlan,
    pdfReportAutoTablePaymentPendient,
    pdfReportAutoMovementStudentByRangeDate,
    pdfReportLiquidationByAdmissionPlan,
    xlxsReportSuneduEntry,
    pdfReportAutoTableCertStudySeunsm,
    pdfReportAutoTableConstancyEntrySeunsm,
    pdfReportAutoTableConstancyStudySeunsm,
    pdfReportAutoTableConstancyEgressSeunsm,
    pdfReportAutoTableConstancyAdeudarSeunsm,
    pdfReportAutoTableConstancyDisciplinarySeunsm,
    // MPT
    pdfReportAutoTableConstancyExpeditoSustentationSeunsm,
};

export default Componet;
